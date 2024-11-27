import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Edit, PlusCircle } from 'lucide-react';

const InvoiceManagement = () => {
  const [invoices, setInvoices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [customerFilter, setCustomerFilter] = useState('');

  const [invoiceForm, setInvoiceForm] = useState({
    invoice_number: '',
    customer_name: '',
    date: '',
    details: [{ description: '', quantity: 1, unit_price: 0 }],
  });

  const fetchInvoices = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/invoices/', {
        params: {
          page: currentPage,
          customer_name: customerFilter.trim(),
        },
      });

      setInvoices(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 10) || 1);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  const saveInvoice = async (e) => {
    e.preventDefault();
    try {
      if (selectedInvoice) {
        await axios.put(
          `https://invoice-managementt.vercel.app/api/invoices/${selectedInvoice.id}/`,
          invoiceForm
        );
      } else {
        await axios.post('https://invoice-managementt.vercel.app/api/invoices/', invoiceForm);
      }
      fetchInvoices();
      resetForm();
    } catch (error) {
      console.error('Error saving invoice:', error);
    }
  };

  const deleteInvoice = async (id) => {
    try {
      await axios.delete(`https://invoice-managementt.vercel.app/api/invoices/${id}/`);
      fetchInvoices();
    } catch (error) {
      console.error('Error deleting invoice:', error);
    }
  };

  const resetForm = () => {
    setSelectedInvoice(null);
    setInvoiceForm({
      invoice_number: '',
      customer_name: '',
      date: '',
      details: [{ description: '', quantity: 1, unit_price: 0 }],
    });
  };

  const addLineItem = () => {
    setInvoiceForm((prev) => ({
      ...prev,
      details: [...prev.details, { description: '', quantity: 1, unit_price: 0 }],
    }));
  };

  useEffect(() => {
    fetchInvoices();
  }, [currentPage, customerFilter]);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 flex flex-col items-center">
      <h1 className="text-center text-4xl font-extrabold text-blue-600 mb-8">
        Invoice Management System
      </h1>
      <div className="space-y-8 w-full">
        {/* Invoice List */}
        <div className="bg-gray-50 rounded-lg shadow-lg overflow-hidden w-full">
          <div className="p-4 bg-blue-100 border-b">
            <input
              type="text"
              placeholder="Search by Customer"
              value={customerFilter}
              onChange={(e) => setCustomerFilter(e.target.value)}
              className="w-full border px-3 py-2 rounded-md shadow-sm"
            />
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-blue-200">
              <tr>
                <th className="py-2 px-4">Invoice</th>
                <th className="py-2 px-4">Customer</th>
                <th className="py-2 px-4">Total</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="border-b">
                  <td className="py-2 px-4">{invoice.invoice_number}</td>
                  <td className="py-2 px-4">{invoice.customer_name}</td>
                  <td className="py-2 px-4">${invoice.total_amount}</td>
                  <td className="py-2 px-4 flex space-x-2">
                    <button
                      onClick={() => setSelectedInvoice(invoice)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => deleteInvoice(invoice.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between p-4 bg-blue-50">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        {/* Invoice Form */}
        <div className="bg-white shadow-lg rounded-lg p-6 w-full">
          <form onSubmit={saveInvoice}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Invoice Number"
                value={invoiceForm.invoice_number}
                onChange={(e) =>
                  setInvoiceForm((prev) => ({ ...prev, invoice_number: e.target.value }))
                }
                className="p-2 border rounded-md shadow-sm"
                required
              />
              <input
                type="text"
                placeholder="Customer Name"
                value={invoiceForm.customer_name}
                onChange={(e) =>
                  setInvoiceForm((prev) => ({ ...prev, customer_name: e.target.value }))
                }
                className="p-2 border rounded-md shadow-sm"
                required
              />
              <input
                type="date"
                value={invoiceForm.date}
                onChange={(e) =>
                  setInvoiceForm((prev) => ({ ...prev, date: e.target.value }))
                }
                className="p-2 border rounded-md shadow-sm"
                required
              />
            </div>

            <div className="space-y-4 mb-4">
              {invoiceForm.details.map((detail, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Description"
                    value={detail.description}
                    onChange={(e) => {
                      const newDetails = [...invoiceForm.details];
                      newDetails[index].description = e.target.value;
                      setInvoiceForm((prev) => ({ ...prev, details: newDetails }));
                    }}
                    className="p-2 border rounded-md shadow-sm"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={detail.quantity}
                    onChange={(e) => {
                      const newDetails = [...invoiceForm.details];
                      newDetails[index].quantity = parseInt(e.target.value, 10);
                      setInvoiceForm((prev) => ({ ...prev, details: newDetails }));
                    }}
                    className="p-2 border rounded-md shadow-sm"
                    min="1"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Unit Price"
                    value={detail.unit_price}
                    onChange={(e) => {
                      const newDetails = [...invoiceForm.details];
                      newDetails[index].unit_price = parseFloat(e.target.value);
                      setInvoiceForm((prev) => ({ ...prev, details: newDetails }));
                    }}
                    className="p-2 border rounded-md shadow-sm"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={addLineItem}
                className="bg-teal-500 text-white px-4 py-2 rounded-md flex items-center"
              >
                <PlusCircle size={20} className="mr-2" />
                Add Item
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                {selectedInvoice ? 'Update Invoice' : 'Create Invoice'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 text-gray-500 text-sm text-center">
        Created by Pushpraj Dubey
      </footer>
    </div>
  );
};

export default InvoiceManagement;