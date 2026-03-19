import { useNavigate } from "react-router-dom"; 
import { useState } from "react";
import './Landing.css'

export default function LandingPage() {

    const navigate = useNavigate();
    const [doorOpen, setDoorOpen] = useState(false);

    const handleEnter = () => {
        setDoorOpen(true);
        setTimeout(() => {
            navigate('/login');
        }, 1500)
    };

    return (
        <div className="main">
            <div className="sigil">🜃</div>

            <div className="message-container">
                <p className="main-message">
                Non-magicals will be mildly confused. Proceed anyway?
                </p>
                <p className="sub-message">
                (Warning: Last person who entered uninvited is still a ferret.)
                </p>

            </div>
            <div className="door-container">

            <img
            src="/glowing-door.jpg"
            alt="Glowing Magical Door"
            className={`door ${doorOpen ? 'door-open' : 'door-closed'}`}
            onClick={handleEnter}
            />
            <p className="bottom-message">Will you step through the portal?</p>
            </div>

        </div>
    );
}