import { useState, useRef, useEffect } from "react";
import "../styles/Contact.css";

const MESSAGE_MAX_LENGTH = 500;

export default function Contact() {
    const [formValues, setFormValues] = useState({
        name: "",
        email: "",
        message: "",
    });

    const [isSubmitted, setIsSubmitted] = useState(false);

    function handleInputChange(e){
        const { name, value } = e.target;
        setFormValues((prev) => ({...prev, [name]: value }));
    }

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
    // Only show an error under a filed once the user has actually typed it in,
    // otherwise every filed would show red before
    const [touchedFields, setTouchedFields] = useState({});

    function handleBlur(e) {
        setTouchedFields((prev) => ({...prev, [e.target.name]: true }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (hasErrors) return;

        // Will implement real submission in the future
        // For now, just confirm it was "sent"
        setIsSubmitted(true);
        setFormValues({ name: "", email: "", message: ""});
        setTouchedFields({});
    }

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
                    autocomplete="off"
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
                    autocomplete="off"
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