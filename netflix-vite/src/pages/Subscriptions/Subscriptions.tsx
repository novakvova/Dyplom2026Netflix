import React, { useState } from "react";
import "./Subscriptions.css";

type SubscriptionPlan = {
    id: number;
    name: "Free" | "Normal" | "Premium";
    price: number;
    billingCycle: string;
    features: string[];
    status: "Active" | "Inactive";
};

const initialPlans: SubscriptionPlan[] = [
    {
        id: 1,
        name: "Free",
        price: 0,
        billingCycle: "month",
        features: ["720p Resolution", "Contains Ads", "1 Device watch at a time"],
        status: "Active"
    },
    {
        id: 2,
        name: "Normal",
        price: 9.99,
        billingCycle: "month",
        features: ["1080p Full HD", "No Ads", "2 Devices watch at a time", "Offline downloads"],
        status: "Active"
    },
    {
        id: 3,
        name: "Premium",
        price: 14.99,
        billingCycle: "month",
        features: ["4K + HDR Resolution", "No Ads", "4 Devices watch at a time", "Spatial Audio", "Ultra Quality Offline"],
        status: "Active"
    }
];

const Subscriptions: React.FC = () => {
    const [plans, setPlans] = useState<SubscriptionPlan[]>(initialPlans);

    const [editingPlanId, setEditingPlanId] = useState<number | null>(null);
    const [priceInput, setPriceInput] = useState<string>("");

    const startEditingPrice = (id: number, currentPrice: number) => {
        setEditingPlanId(id);
        setPriceInput(currentPrice.toString());
    };

    const savePrice = (id: number) => {
        const newPrice = parseFloat(priceInput);
        if (isNaN(newPrice) || newPrice < 0) {
            alert("Please enter a valid price!");
            return;
        }

        setPlans(prevPlans =>
            prevPlans.map(plan =>
                plan.id === id ? { ...plan, price: newPrice } : plan
            )
        );
        setEditingPlanId(null);
    };

    const togglePlanStatus = (id: number) => {
        setPlans(prevPlans =>
            prevPlans.map(plan =>
                plan.id === id
                    ? { ...plan, status: plan.status === "Active" ? "Inactive" : "Active" }
                    : plan
            )
        );
    };

    return (
        <div className="subscriptions-page">
            <div className="subscriptions-header">
                <h1>Subscription Plans</h1>
            </div>

            <div className="plans-cards-container">
                {plans.map((plan) => (
                    <div key={plan.id} className={`plan-card ${plan.name.toLowerCase()} ${plan.status.toLowerCase()}`}>
                        <div className="plan-badge">{plan.name}</div>
                        <div className="plan-price">
                            <span className="amount">${plan.price}</span>
                            <span className="cycle">/{plan.billingCycle}</span>
                        </div>
                        <ul className="plan-features-list">
                            {plan.features.map((feature, idx) => (
                                <li key={idx}>✓ {feature}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="table-container">
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Plan Name</th>
                        <th>Price</th>
                        <th>Billing Cycle</th>
                        <th>Features Count</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {plans.map((plan) => {
                        const isEditingThisPlan = editingPlanId === plan.id;

                        return (
                            <tr key={plan.id}>
                                <td>{plan.id}</td>
                                <td>
                                    <strong className={`plan-text-${plan.name.toLowerCase()}`}>
                                        {plan.name}
                                    </strong>
                                </td>

                                <td>
                                    {isEditingThisPlan ? (
                                        <div className="price-edit-form">
                                            <span>$</span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                className="table-price-input"
                                                value={priceInput}
                                                onChange={(e) => setPriceInput(e.target.value)}
                                                autoFocus
                                            />
                                        </div>
                                    ) : (
                                        `$${plan.price}`
                                    )}
                                </td>

                                <td>Per {plan.billingCycle}</td>
                                <td>{plan.features.length} features</td>
                                <td>
                                        <span className={`status ${plan.status.toLowerCase()}`}>
                                            {plan.status}
                                        </span>
                                </td>

                                <td className="actions">
                                    {isEditingThisPlan ? (
                                        <>
                                            <button className="save-btn" onClick={() => savePrice(plan.id)}>Save</button>
                                            <button className="cancel-btn" onClick={() => setEditingPlanId(null)}>Cancel</button>
                                        </>
                                    ) : (
                                        <>
                                            <button className="edit-btn" onClick={() => startEditingPrice(plan.id, plan.price)}>
                                                Edit Price
                                            </button>
                                            <button
                                                className={plan.status === "Active" ? "toggle-inactive-btn" : "toggle-active-btn"}
                                                onClick={() => togglePlanStatus(plan.id)}
                                            >
                                                {plan.status === "Active" ? "Deactivate" : "Activate"}
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Subscriptions;