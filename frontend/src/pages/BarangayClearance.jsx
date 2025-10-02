import React, { useState } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import Layout from '../components/Layout';

const BarangayClearance = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    purpose: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generatePdf = async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    page.drawText('Barangay Clearance', {
      x: 50,
      y: height - 4 * 24,
      size: 24,
      font,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Name: ${formData.name}`, {
      x: 50,
      y: height - 6 * 24,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Address: ${formData.address}`, {
      x: 50,
      y: height - 7 * 24,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Purpose: ${formData.purpose}`, {
      x: 50,
      y: height - 8 * 24,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'barangay-clearance.pdf';
    link.click();
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold">Barangay Clearance</h1>
      <form>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Name</span>
          </label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="input input-bordered" />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Address</span>
          </label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" className="input input-bordered" />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Purpose</span>
          </label>
          <input type="text" name="purpose" value={formData.purpose} onChange={handleChange} placeholder="Purpose" className="input input-bordered" />
        </div>
        <div className="form-control mt-6">
          <button type="button" className="btn btn-primary" onClick={generatePdf}>Generate PDF</button>
        </div>
      </form>
    </Layout>
  );
};

export default BarangayClearance;