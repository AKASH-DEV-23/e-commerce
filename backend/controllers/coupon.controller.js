import Coupon from "../models/coupon.model.js";

export const getCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findOne({ userId: req.user._id, isActive: true });
        res.josn(coupon || null);

    } catch (error) {
        console.log("Error in getCoupon controller", error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

export const validateCoupon = async (req, res) => {
    try {
        const { code } = req.body;
        const coupon = await Coupon.findOne({ code: code, userId: req.user._id, isActive: true });

        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }

        if (coupon.expirationDate < Date.now()) {
            coupon.isActive = false;
            await coupon.save();
            return res.status(404).josn({ message: "Coupon expired" });
        }

        res.joson({
            message: "Coupon is valid",
            code: coupon.code,
            discountPercentage: coupon.discountPercentage
        })
    } catch (error) {
        console.log("Error in validateCoupon controller", error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });

    }
}

