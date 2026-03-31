import React, { useEffect, useState } from 'react'
import { useUserAuth } from '../../hooks/useUserAuth';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';
import axiosInstance from '../../utils/axiosInstance';
import ExpenseOverview from '../../components/Expense/ExpenseOverview';
import AddExpenseForm from '../../components/Expense/AddExpenseForm';
import Modal from '../../components/Modal';
import ExpenseList from '../../components/Expense/ExpenseList';
import DeleteAlert from '../../components/DeleteAlert';

function Expence() {
  useUserAuth();

  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null
  })
  const [OpenAddExpenseModel, setOpenAddExpenseModel] = useState(false);

  // Get All Expense Details
  const fetchExpenseDetails = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `${API_PATHS.EXPENSE.GET_ALL_EXPENSE}`
      );

      if (response.data) {
        setExpenseData(response.data);
      }

    } catch (err) {
      console.log("Something went wrong. Please try again.", err);
    } finally {
      setLoading(false)
    }
  }

  // Handle Add Expense
  const handleAddExpense = async (expense) => {
    const { category, amount, date, icon } = expense;

    // Validations Checks
    if (!category) {
      toast.error('category is required');
      return
    }

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Amount should ba a valid number greater than 0.")
      return;
    }

    if (!date) {
      toast.error('Date is required.')
      return;
    }

    try {
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        category,
        amount,
        date,
        icon
      });

      setOpenAddExpenseModel(false);
      toast.success('Expense added Successfully');
      fetchExpenseDetails();
    } catch (err) {
      console.error(
        'Error adding expense',
        error.response?.data?.message || err.message
      );
    }
  }

   // Delete Expense
  const deleteExpense = async(id) => {
    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));

      setOpenDeleteAlert({show: false, data: null});
      toast.success('Expense details deleted successfully');
      fetchExpenseDetails();
    } catch (err) {
      console.error(
        'Error deleting expense:',
        err.response?.data?.message || err.message
      );
      
    }
  }

  // Handle download expense details
  const handleDownloadExpenseDetails = async() => {
       try {
      const response = await axiosInstance.get(
        API_PATHS.EXPENSE.DOWNLOAD_EXPENSE,
        {
          responseType: 'blob'
        }
      );

      // Create a URL for the blob 
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'expense_details.xlsx');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading expense details', err);
      toast.error('Failed to download expense details. Please try again.')
    }
  }


  useEffect(() => {
    fetchExpenseDetails()
    
    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu='Expense'>
      <div className='my-5 mx-auto'>
        <div className='grid grid-col-1 gap-6'>
          <div className=''>
             <ExpenseOverview
                transactions={expenseData}
                onExpenseIncome={() => setOpenAddExpenseModel(true)}
             />
          </div>

          <ExpenseList 
            transactions={expenseData}
            onDelete={(id) => {
              setOpenDeleteAlert({show: true, data: id});
            }}

            onDownload={handleDownloadExpenseDetails}
          />

        </div>

       <Modal
         isOpen={OpenAddExpenseModel}
         onClose={() => setOpenAddExpenseModel(false)}
         title='Add Expense'
       >
          <AddExpenseForm onAddExpense={handleAddExpense} />
       </Modal>

       <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({show: false, data: null})}
          title='Delete Expense'
        >
          <DeleteAlert 
             content='Are you sure you went to delete this expense detail?'
             onDelete={() => deleteExpense(openDeleteAlert.data)}
          />
        </Modal>

      </div>
    </DashboardLayout>
  )
}

export default Expence