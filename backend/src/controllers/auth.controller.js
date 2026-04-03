const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const prisma = require("../config/prisma");
const AppError = require("../utils/AppError");
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require("../utils/jwt");
const { sendEmail, emailTemplates } = require("../utils/email");
const { sendSuccess, sendCreated } = require("../utils/apiResponse");

// ─── Register ─────────────────────────────────────────────────────────────────
const register = async (req, res, next) => {
    try {
        const { email, password, firstName, lastName, phone, role } = req.body;

        // Check duplicate
        const exists = await prisma.user.findUnique({ where: { email } });
        if (exists) throw new AppError("Email already in use.", 409);

        // Hash password (10 rounds = good balance of security & speed)
        const passwordHash = await bcrypt.hash(password, 10);

        // Email verification token
        const emailVerifyToken = crypto.randomBytes(32).toString("hex");

        // Create user + profile
        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
                firstName,
                lastName: lastName || "",
                phone,
                role: role || "PATIENT",
                emailVerifyToken,
                profile: { create: {} },
            },
            select: { id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true },
        });

        // Create streak and send email (non-blocking, fire and forget)
        Promise.all([
            prisma.streak.create({ data: { userId: user.id } }).catch(() => { }),
            (async () => {
                // Use backend URL for verification (returns HTML with redirect)
                let backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
                // Remove trailing slash if present
                backendUrl = backendUrl.replace(/\/$/, '');
                const verifyLink = `${backendUrl}/api/v1/auth/verify-email/${emailVerifyToken}`;
                const { subject, html } = emailTemplates.verification(firstName, verifyLink);
                await sendEmail(email, subject, html).catch(() => { });
            })()
        ]);

        // Return verification link in response for testing (will be hidden in production UI)
        let backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
        backendUrl = backendUrl.replace(/\/$/, '');
        const verifyLink = `${backendUrl}/api/v1/auth/verify-email/${emailVerifyToken}`;
        sendCreated(res, { user, verifyLink }, "Registration successful. Please verify your email.");
    } catch (err) {
        next(err);
    }
};

// ─── Verify Email ─────────────────────────────────────────────────────────────
const verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.params;

        const user = await prisma.user.findFirst({ where: { emailVerifyToken: token } });
        if (!user) {
            return res.send(`
                <html>
                    <head>
                        <title>Email Verification</title>
                        <style>
                            body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #f3f4f6; }
                            .container { text-align: center; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
                            h1 { color: #dc2626; margin: 0 0 10px 0; }
                            p { color: #4b5563; margin: 0 0 20px 0; }
                            a { display: inline-block; background: #2F5B8C; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h1>Verification Link Expired</h1>
                            <p>Sorry, this link has expired. Please try signing up again.</p>
                            <a href="${process.env.FRONTEND_URL || 'https://craftathon.vercel.app'}/signup">Back to Signup</a>
                        </div>
                    </body>
                </html>
            `);
        }

        await prisma.user.update({
            where: { id: user.id },
            data: { isEmailVerified: true, emailVerifyToken: null },
        });

        // Send HTML redirect to login
        res.send(`
            <html>
                <head>
                    <title>Email Verified - Redirecting...</title>
                    <meta http-equiv="refresh" content="2;url=${process.env.FRONTEND_URL || 'https://craftathon.vercel.app'}/login">
                    <style>
                        body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #f3f4f6; }
                        .container { text-align: center; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
                        .success { color: #16a34a; font-size: 48px; margin: 0 0 20px 0; }
                        h1 { color: #1f2937; margin: 0 0 10px 0; }
                        p { color: #4b5563; margin: 0 0 20px 0; }
                        a { display: inline-block; background: #2F5B8C; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="success">✓</div>
                        <h1>You successfully verified your email!</h1>
                        <p>Redirecting to login in 2 seconds...</p>
                        <p>If not redirected, <a href="${process.env.FRONTEND_URL || 'https://craftathon.vercel.app'}/login">click here to continue</a></p>
                    </div>
                </body>
            </html>
        `);
    } catch (err) {
        next(err);
    }
};

// ─── Login ────────────────────────────────────────────────────────────────────
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
            throw new AppError("Invalid email or password.", 401);
        }
        if (!user.isActive) throw new AppError("Account deactivated. Contact support.", 403);
        if (!user.isEmailVerified) throw new AppError("Please verify your email first. Check your inbox for the verification link.", 403);

        const payload = { id: user.id, role: user.role };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        // Store refresh token (non-blocking)
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);
        prisma.refreshToken.create({ data: { token: refreshToken, userId: user.id, expiresAt } }).catch(() => { }); // fire and forget

        sendSuccess(res, {
            accessToken,
            refreshToken,
            user: {
                id: user.id, email: user.email, firstName: user.firstName,
                lastName: user.lastName, role: user.role, isEmailVerified: user.isEmailVerified,
            },
        }, "Login successful.");
    } catch (err) {
        next(err);
    }
};

// ─── Refresh Token ────────────────────────────────────────────────────────────
const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken: token } = req.body;
        if (!token) throw new AppError("Refresh token required.", 400);

        const decoded = verifyRefreshToken(token);

        const stored = await prisma.refreshToken.findUnique({ where: { token } });
        if (!stored || stored.expiresAt < new Date()) {
            throw new AppError("Invalid or expired refresh token.", 401);
        }

        // Rotate token
        await prisma.refreshToken.delete({ where: { token } });

        const payload = { id: decoded.id, role: decoded.role };
        const newAccessToken = generateAccessToken(payload);
        const newRefreshToken = generateRefreshToken(payload);

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);
        await prisma.refreshToken.create({
            data: { token: newRefreshToken, userId: decoded.id, expiresAt },
        });

        sendSuccess(res, { accessToken: newAccessToken, refreshToken: newRefreshToken }, "Token refreshed.");
    } catch (err) {
        next(err);
    }
};

// ─── Logout ───────────────────────────────────────────────────────────────────
const logout = async (req, res, next) => {
    try {
        const { refreshToken: token } = req.body;
        if (token) {
            await prisma.refreshToken.deleteMany({ where: { token } }).catch(() => { });
        }
        sendSuccess(res, {}, "Logged out successfully.");
    } catch (err) {
        next(err);
    }
};

// ─── Forgot Password ──────────────────────────────────────────────────────────
const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        // Always return success to prevent email enumeration
        if (!user) return sendSuccess(res, {}, "If that email exists, a reset link has been sent.");

        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        await prisma.user.update({
            where: { id: user.id },
            data: { resetToken, resetTokenExpiry },
        });

        const link = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        const { subject, html } = emailTemplates.resetPassword(user.firstName, link);
        await sendEmail(email, subject, html);

        sendSuccess(res, {}, "If that email exists, a reset link has been sent.");
    } catch (err) {
        next(err);
    }
};

// ─── Reset Password ───────────────────────────────────────────────────────────
const resetPassword = async (req, res, next) => {
    try {
        const { token, password } = req.body;

        const user = await prisma.user.findFirst({
            where: { resetToken: token, resetTokenExpiry: { gt: new Date() } },
        });
        if (!user) throw new AppError("Invalid or expired reset token.", 400);

        const passwordHash = await bcrypt.hash(password, 12);
        await prisma.user.update({
            where: { id: user.id },
            data: { passwordHash, resetToken: null, resetTokenExpiry: null },
        });
        // Invalidate all refresh tokens
        await prisma.refreshToken.deleteMany({ where: { userId: user.id } });

        sendSuccess(res, {}, "Password reset successful. Please log in.");
    } catch (err) {
        next(err);
    }
};

// ─── Get Me ───────────────────────────────────────────────────────────────────
const getMe = async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true, email: true, firstName: true, lastName: true,
                phone: true, role: true, isEmailVerified: true, isActive: true, createdAt: true,
                profile: true,
            },
        });
        sendSuccess(res, { user });
    } catch (err) {
        next(err);
    }
};

module.exports = { register, verifyEmail, login, refreshToken, logout, forgotPassword, resetPassword, getMe };
