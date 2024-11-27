import { useState, useEffect } from 'react';
import { Trash2, Edit, PlusCircle, Search, X } from 'lucide-react';
import axios from 'axios';

const InvoiceManagement = () => {
  const [invoices, setInvoices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [customerFilter, setCustomerFilter] = useState('');
  const [showForm, setShowForm] = useState(false);

  const [invoiceForm, setInvoiceForm] = useState({
    invoice_number: '',
    customer_name: '',
    date: '',
    details: [{ description: '', quantity: 1, unit_price: 0 }],
  });

  const fetchInvoices = async () => {
    try {
      const response = await axios.get('https://invoice-managementt.vercel.app/api/invoices/', {
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
      setShowForm(false);
    } catch (error) {
      console.error('Error saving invoice:', error);
    }
  };

  const deleteInvoice = async (id) => {
    try {
      await axios.delete(`https://invoice-managementt.vercel.app/invoices/${id}/`);
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-5xl font-black text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600">
          Invoice Management System
        </h1>

        {/* Actions Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-400" size={20} />
            <input
              type="text"
              placeholder="Search by customer name..."
              value={customerFilter}
              onChange={(e) => setCustomerFilter(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-transparent bg-white shadow-lg focus:border-indigo-400 focus:ring-0 transition-all duration-300"
            />
            {customerFilter && (
              <button
                onClick={() => setCustomerFilter('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
          >
            <PlusCircle size={20} />
            New Invoice
          </button>
        </div>

        {/* Invoice List */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden border border-indigo-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <th className="py-6 px-8 text-left text-gray-700 font-semibold">Invoice</th>
                  <th className="py-6 px-8 text-left text-gray-700 font-semibold">Customer</th>
                  <th className="py-6 px-8 text-left text-gray-700 font-semibold">Total</th>
                  <th className="py-6 px-8 text-left text-gray-700 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="border-b border-indigo-50 hover:bg-indigo-50/30 transition-colors duration-200"
                  >
                    <td className="py-6 px-8 font-medium text-indigo-600">{invoice.invoice_number}</td>
                    <td className="py-6 px-8">{invoice.customer_name}</td>
                    <td className="py-6 px-8 font-medium text-gray-900">${invoice.total_amount}</td>
                    <td className="py-6 px-8">
                      <div className="flex gap-4">
                        <button
                          onClick={() => {
                            setSelectedInvoice(invoice);
                            setShowForm(true);
                          }}
                          className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-xl transition-colors duration-200"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => deleteInvoice(invoice.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-xl transition-colors duration-200"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center p-8 bg-gradient-to-r from-indigo-50 to-purple-50">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              className="px-8 py-3 bg-white rounded-xl shadow-sm disabled:opacity-50 hover:shadow-md transition-all duration-200 text-gray-700 font-medium"
            >
              Previous
            </button>
            <span className="px-6 py-3 bg-white rounded-xl shadow-sm font-medium text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              className="px-8 py-3 bg-white rounded-xl shadow-sm disabled:opacity-50 hover:shadow-md transition-all duration-200 text-gray-700 font-medium"
            >
              Next
            </button>
          </div>
        </div>

        {/* Invoice Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-8 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h2 className="text-3xl font-bold text-gray-800">
                    {selectedInvoice ? 'Edit Invoice' : 'Create Invoice'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                    }}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <form onSubmit={saveInvoice} className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <input
                    type="text"
                    placeholder="Invoice Number"
                    value={invoiceForm.invoice_number}
                    onChange={(e) =>
                      setInvoiceForm((prev) => ({ ...prev, invoice_number: e.target.value }))
                    }
                    className="p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-400 focus:ring-0 transition-all duration-200"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Customer Name"
                    value={invoiceForm.customer_name}
                    onChange={(e) =>
                      setInvoiceForm((prev) => ({ ...prev, customer_name: e.target.value }))
                    }
                    className="p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-400 focus:ring-0 transition-all duration-200"
                    required
                  />
                  <input
                    type="date"
                    value={invoiceForm.date}
                    onChange={(e) =>
                      setInvoiceForm((prev) => ({ ...prev, date: e.target.value }))
                    }
                    className="p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-400 focus:ring-0 transition-all duration-200"
                    required
                  />
                </div>

                <div className="space-y-6">
                  {invoiceForm.details.map((detail, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-indigo-50 rounded-2xl">
                      <input
                        type="text"
                        placeholder="Description"
                        value={detail.description}
                        onChange={(e) => {
                          const newDetails = [...invoiceForm.details];
                          newDetails[index].description = e.target.value;
                          setInvoiceForm((prev) => ({ ...prev, details: newDetails }));
                        }}
                        className="p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-400 focus:ring-0 transition-all duration-200"
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
                        className="p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-400 focus:ring-0 transition-all duration-200"
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
                        className="p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-400 focus:ring-0 transition-all duration-200"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-between pt-6">
                  <button
                    type="button"
                    onClick={addLineItem}
                    className="px-8 py-4 bg-indigo-100 text-indigo-600 rounded-xl font-medium hover:bg-indigo-200 transition-colors duration-200 flex items-center gap-2"
                  >
                    <PlusCircle size={20} />
                    Add Item
                  </button>
                  <button
                    type="submit"
                    className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    {selectedInvoice ? 'Update Invoice' : 'Create Invoice'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <footer className="mt-16 text-center text-gray-500 text-sm">
        Created by Pushpraj Dubey
      </footer>
    </div>
  );
};

export default InvoiceManagement;