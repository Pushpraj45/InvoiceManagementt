import { useState, useEffect } from "react";
import { Trash2, Edit, PlusCircle, Sun, Moon } from "lucide-react";

const InvoiceList = ({
  invoices,
  deleteInvoice,
  setSelectedInvoice,
  currentPage,
  setCurrentPage,
  totalPages,
  customerFilter,
  setCustomerFilter,
}) => (
  <div className="w-full bg-white rounded-xl p-8 shadow-2xl border border-blue-200">
    <div className="mb-6">
      <input
        type="text"
        placeholder="Search Invoices by Customer Name"
        value={customerFilter}
        onChange={(e) => setCustomerFilter(e.target.value)}
        className="w-full p-4 text-lg border-2 border-blue-300 rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
      />
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-blue-100 text-blue-900 uppercase tracking-wider">
            <th className="p-4 text-left font-semibold">Invoice #</th>
            <th className="p-4 text-left font-semibold">Customer</th>
            <th className="p-4 text-left font-semibold">Total</th>
            <th className="p-4 text-left font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id} className="border-b border-blue-100 hover:bg-blue-50 transition">
              <td className="p-4 font-medium text-blue-900">{invoice.invoice_number}</td>
              <td className="p-4 text-blue-800">{invoice.customer_name}</td>
              <td className="p-4 font-bold text-blue-900">${invoice.total_amount}</td>
              <td className="p-4 flex space-x-2">
                <button
                  onClick={() => setSelectedInvoice(invoice)}
                  className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => deleteInvoice(invoice.id)}
                  className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="flex justify-between items-center mt-6 space-x-4">
      <button
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
        className="px-6 py-3 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 disabled:opacity-50 transition"
      >
        Previous
      </button>
      <span className="text-blue-900 font-medium">
        Page {currentPage} of {totalPages}
      </span>
      <button
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
        className="px-6 py-3 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 disabled:opacity-50 transition"
      >
        Next
      </button>
    </div>
  </div>
);

const InvoiceForm = ({
  invoiceForm,
  setInvoiceForm,
  saveInvoice,
  addLineItem,
  selectedInvoice,
}) => (
  <div className="w-full bg-white rounded-xl p-8 shadow-2xl border border-blue-200">
    <form onSubmit={saveInvoice} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <input
          type="text"
          placeholder="Invoice Number"
          value={invoiceForm.invoice_number}
          onChange={(e) =>
            setInvoiceForm((prev) => ({ ...prev, invoice_number: e.target.value }))
          }
          className="p-4 text-lg border-2 border-blue-300 rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          required
        />
        <input
          type="text"
          placeholder="Customer Name"
          value={invoiceForm.customer_name}
          onChange={(e) =>
            setInvoiceForm((prev) => ({ ...prev, customer_name: e.target.value }))
          }
          className="p-4 text-lg border-2 border-blue-300 rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          required
        />
        <input
          type="date"
          value={invoiceForm.date}
          onChange={(e) =>
            setInvoiceForm((prev) => ({ ...prev, date: e.target.value }))
          }
          className="p-4 text-lg border-2 border-blue-300 rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          required
        />
      </div>
      <div className="space-y-4">
        {invoiceForm.details.map((detail, index) => (
          <div key={index} className="grid grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Description"
              value={detail.description}
              onChange={(e) => {
                const newDetails = [...invoiceForm.details];
                newDetails[index].description = e.target.value;
                setInvoiceForm((prev) => ({ ...prev, details: newDetails }));
              }}
              className="p-3 border-2 border-blue-300 rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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
              min="1"
              className="p-3 border-2 border-blue-300 rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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
              step="0.01"
              min="0"
              className="p-3 border-2 border-blue-300 rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={addLineItem}
          className="flex items-center bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
        >
          <PlusCircle size={20} className="mr-2" />
          Add Line Item
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition"
        >
          {selectedInvoice ? "Update Invoice" : "Create Invoice"}
        </button>
      </div>
    </form>
  </div>
);

const InvoiceManagement = () => {
  const [theme, setTheme] = useState("light");
  const [invoices, setInvoices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [customerFilter, setCustomerFilter] = useState("");
  const [invoiceForm, setInvoiceForm] = useState({
    invoice_number: "",
    customer_name: "",
    date: "",
    details: [{ description: "", quantity: 1, unit_price: 0 }],
  });

  useEffect(() => {
    // Fetch invoices from API
  }, [currentPage, customerFilter]);

  return (
    <div className={`${theme === "dark" ? "bg-blue-950 text-white" : "bg-blue-50"} min-h-screen`}>
      <header className="p-6 bg-blue-100 shadow-md flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-900">Invoice Management</h1>
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="p-3 bg-blue-200 rounded-lg hover:bg-blue-300 flex items-center space-x-2 transition"
        >
          {theme === "light" ? <Moon size={24} className="text-blue-800" /> : <Sun size={24} className="text-blue-100" />}
          <span className="text-blue-900">{theme === "light" ? "Dark" : "Light"} Mode</span>
        </button>
      </header>
      <div className="container mx-auto py-10 space-y-10">
        <InvoiceList
          invoices={invoices}
          deleteInvoice={(id) => setInvoices(invoices.filter((i) => i.id !== id))}
          setSelectedInvoice={setSelectedInvoice}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          customerFilter={customerFilter}
          setCustomerFilter={setCustomerFilter}
        />
        <InvoiceForm
          invoiceForm={invoiceForm}
          setInvoiceForm={setInvoiceForm}
          saveInvoice={(e) => {
            e.preventDefault();
            const updatedInvoices = [...invoices, invoiceForm];
            setInvoices(updatedInvoices);
            setInvoiceForm({
              invoice_number: "",
              customer_name: "",
              date: "",
              details: [{ description: "", quantity: 1, unit_price: 0 }],
            });
          }}
          addLineItem={() =>
            setInvoiceForm((prev) => ({
              ...prev,
              details: [...prev.details, { description: "", quantity: 1, unit_price: 0 }],
            }))
          }
          selectedInvoice={selectedInvoice}
        />
      </div>
    </div>
  );
};

export default InvoiceManagement;