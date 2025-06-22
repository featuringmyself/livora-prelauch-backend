import express from "express";
import Lead from "../models/lead.model.js";

const createLead = async (req, res) => {
    try {
        const { email } = req.body;  // Fixed: removed the extra !
        
        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Please provide a valid email address"
            });
        }

        const leadExists = await Lead.findOne({ email });
        if (leadExists) {
            return res.status(409).json({  // Changed to 409 for conflict
                message: "Lead already exists"
            });
        }

        const lead = await Lead.create({ email });

        res.status(201).json({
            message: "Lead created successfully",
            data: lead
        });
    } catch (error) {
        console.error("Error creating lead:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

export { createLead };