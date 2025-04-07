import React from 'react';
import './CreditTracker.css';

export default function CreditTracker({
    name = 'Jane Doe',
    netId = 'Net ID',
    completed = 75,
    inProgress = 15,
    remaining = 30,
    onEdit = () => alert('Edit clicked')
}) {
    return (
        <div className="tracker-container">
            <div className="tracker-header" />

            <div className="tracker-content">
                <div className="profile-image" />
                <div className="profile-name">{name}</div>
                <div className="profile-id">{netId}</div>

                <div className="credit-box">
                    Credits Completed: {completed}
                </div>
                <div className="credit-box">
                    Credits In‑Progress: {inProgress}
                </div>
                <div className="credit-box">
                    Credits Remaining: {remaining}
                </div>
            </div>

            <button className="edit-button" onClick={onEdit}>
                Edit
            </button>

            <div className="corner-dot top-left" />
            <div className="corner-dot top-right" />
            <div className="corner-dot bottom-left" />
            <div className="corner-dot bottom-right" />
        </div>
    );
}
