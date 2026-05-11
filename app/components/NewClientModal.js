"use client";

import { useState } from 'react';
import { X } from 'lucide-react';
import styles from './NewClientModal.module.css';

export default function NewClientModal({ isOpen, onClose, onCreate }) {
    if (!isOpen) return null;

    const [formData, setFormData] = useState({
        name: '',
        industry: '',
        source: '',
        owner: '',
        priority: 'High',
        services: {
            seo: false,
            ads: false,
            content: false,
            dev: false
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            services: { ...prev.services, [name]: checked }
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onCreate(formData);
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h3>New Client</h3>
                    <button onClick={onClose}><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label>Client Name</label>
                        <input name="name" type="text" placeholder="e.g. Acme Corp" required value={formData.name} onChange={handleChange} />
                    </div>

                    <div className={styles.row}>
                        <div className={styles.formGroup}>
                            <label>Industry</label>
                            <input name="industry" type="text" placeholder="e.g. SaaS" value={formData.industry} onChange={handleChange} />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Priority</label>
                            <select name="priority" value={formData.priority} onChange={handleChange}>
                                <option>High</option>
                                <option>Medium</option>
                                <option>Low</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.formGroup}>
                            <label>Source</label>
                            <select name="source" value={formData.source} onChange={handleChange}>
                                <option value="">Select...</option>
                                <option value="Referral">Referral</option>
                                <option value="Website">Website</option>
                                <option value="WhatsApp">WhatsApp</option>
                                <option value="Ads">Ads</option>
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Primary Owner</label>
                            <input name="owner" type="text" placeholder="e.g. Sarah" value={formData.owner} onChange={handleChange} />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Expected Services</label>
                        <div className={styles.checkboxes}>
                            <label><input type="checkbox" name="seo" checked={formData.services.seo} onChange={handleCheckboxChange} /> SEO</label>
                            <label><input type="checkbox" name="ads" checked={formData.services.ads} onChange={handleCheckboxChange} /> Ads</label>
                            <label><input type="checkbox" name="content" checked={formData.services.content} onChange={handleCheckboxChange} /> Content</label>
                            <label><input type="checkbox" name="dev" checked={formData.services.dev} onChange={handleCheckboxChange} /> Dev</label>
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <button type="button" onClick={onClose} className={styles.cancelBtn}>Cancel</button>
                        <button type="submit" className={styles.createBtn}>Create Client</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
