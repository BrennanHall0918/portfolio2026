import { useState, useRef, useEffect } from "react";
import "../styles/Contact.css";

const MESSAGE_MAX_LENGTH = 500;

export default function Contact() {
    // Single object holding all three controlled input values
    // one handleInputChange below updates whichever field fired the event.
    const [formValues, setFormValues] = useState({
        name: "",
        email: "",
        message: "",
    });

    const [isSubmitted, setIsSubmitted] = useState(false);

    // Generic controlled-input handler shared by all three fields - reads
    // the input's 'name' attribute to know which key in forValues to
    // update, so this one functions works for all three.
    function handleInputChange(e){
        const { name, value } = e.target;
        setFormValues((prev) => ({...prev, [name]: value }));
    }

    // Pure function of current formValues - recalculated fresh every
    // render (no separate state/useEffect needed, since it has no side
    // effects and nothing async). Returns an object of only the fields
    // that currently have a problem.
    function validate() {
        const errors = {};

        if (formValues.name.trim().length === 0) {
            errors.name = "Name is required.";
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formValues.email.trim().length === 0) {
            errors.email = "Email is required.";
        } else if(!emailRegex.test(formValues.email)) {
            errors.email = "Enter a valid email address.";
        }

        if (formValues.message.trim().length === 0) {
            errors.message = "Message can't be empty.";
        } else if (formValues.message.length > MESSAGE_MAX_LENGTH) {
            errors.message = `Message is too long (${formValues.message.length}/${MESSAGE_MAX_LENGTH}).`;
        }

        return errors;
    }

    const fieldErrors = validate();
    const hasErrors = Object.keys(fieldErrors).length > 0;

    // Tracks which fields the user has actually clicked into and left
    // at least once. Only show an error under a field once the
    // user has actually typed it in, otherwise every field would show red
    // before the user's touched anything.
    const [touchedFields, setTouchedFields] = useState({});

    function handleBlur(e) {
        setTouchedFields((prev) => ({...prev, [e.target.name]: true }));
    }

    function handleSubmit(e) {
        // Stops the browser's native form submission (which would reload the
        // page)
        e.preventDefault();
        // Safety net alongside the submit button's disabled state -even if
        // those two ever briefly disagree, submission still can't go through
        // with active errors
        if (hasErrors) return;

        // Will implement real submission in the future
        // For now, just confirm it was "sent"
        setIsSubmitted(true);
        setFormValues({ name: "", email: "", message: ""});
        setTouchedFields({});
    }

    // Ref on the scrollable form container, used below the auto-scroll the
    // confirmation message into view after submitting. Had an issue with small
    // windows where the confirmation message wouldn't show by default.
    const formContainerRef = useRef(null);

    useEffect(()=> {
        if(isSubmitted && formContainerRef.current) {
            formContainerRef.current.scrollTo({
                top: formContainerRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [isSubmitted]);

    return (
        // This section (not Window.jsx's .window-content) is the actual
        // scrolling container - See Contact.css, which gives it its own
        // height/overflow so formContainerRef has something real to scroll.
        <section className="contact-window" ref={formContainerRef}>
            <div className="contact-titlebar-note">
                <span>Fill out the form below to send a message.</span>
            </div>

            <form className="contact-form" onSubmit={handleSubmit}>
                <div className="formfiled">
                    <label htmlFor="name">Name:</label>
                    <input 
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="off"
                    value={formValues.name}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={touchedFields.name && fieldErrors.name ? "invalid" : ""}
                    />
                    {touchedFields.name && fieldErrors.name && (
                        <span className="field-error">{fieldErrors.name}</span>
                    )}
                </div>

                <section className="form-field">
                    <label htmlFor="email">Email:</label>
                    <input 
                    id="email"
                    name="email"
                    type="text"
                    autoComplete="off"
                    value={formValues.email}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={touchedFields.email && fieldErrors.email ? "invalid" : ""} 
                    />
                    {touchedFields.email && fieldErrors.email && (
                        <span className="field-error">{fieldErrors.email}</span>
                    )}
                </section>

                <section className="form-field">
                    <label htmlFor="message">Message:</label>
                    <textarea 
                    name="message" 
                    id="message"
                    rows={5}
                    value={formValues.message}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={touchedFields.message && fieldErrors.message ? "invalid" : ""}
                    />
                    <div className="char-count">
                        {formValues.message.length}/{MESSAGE_MAX_LENGTH}
                    </div>
                    {touchedFields.message && fieldErrors.message && (
                        <span className="field-error">{fieldErrors.message}</span>
                    )}
                </section>

                {/* Disabled based on live validation state */}
                <button type="submit" className="submit-button" disabled={hasErrors}>
                    Send Message
                </button>

                {isSubmitted && (
                    <div className="submit-confirmation">
                        <span>Message sent successfully.</span>
                    </div>
                )}
            </form>
        </section>
    );
}