import React,{useEffect, useState} from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout';
import IncomeOverView from '../../components/Income/IncomeOverView';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';

import Modal from '../../components/Modal';
import AddIncomeForm from '../../components/Income/AddIncomeForm';
import IncomeList from '../../components/Income/IncomeList';
import DeleteAlert from '../../components/DeleteAlert';

function Income() {
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null
  })
  const [OpenAddIncomeModel, setOpenAddIncomeModel] = useState(false)

  // Get All Income Details
  const fetchIncomeDetails = async() => {
    if(loading) return;

    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `${API_PATHS.INCOME.GET_ALL_INCOME}`
      );

      if(response.data){
        setIncomeData(response.data);
      }

    } catch (err) {
      console.log("Something went wrong. Please try again.", err);
    }finally{
      setLoading(false)
    }
  }

  // Handle Add Income
  const handleAddIncome = async(income) => {
    const {source, amount, date, icon} = income;
  
    // Validations Checks
    if(!source){
      toast.error('Source is required');
      return
    }

    if(!amount || isNaN(amount) || Number(amount) <= 0){
      toast.error("Amount should ba a valid number greater than 0.")
      return;
    }

    if(!date){
      toast.error('Date is required.')
      return; 
    }
  
    try {
      await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME,{
        source,
        amount,
        date,
        icon
      });

      setOpenAddIncomeModel(false);
      toast.success('Income added Successfully');
      fetchIncomeDetails();
    } catch (err) {
      console.error(
        'Error adding income',
        error.response?.data?.message || err.message
      );
    }
  }

  // Delete Income
  const deleteIncome = async(id) => {
    try {
      await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));

      setOpenDeleteAlert({show: false, data: null});
      toast.success('Income details deleted successfully');
      fetchIncomeDetails();
    } catch (err) {
      console.error(
        'Error deleting income:',
        err.response?.data?.message || err.message
      );
      
    }
  }

  // Handle download income details
  const handleDownloadIncomeDetails = async() => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.INCOME.DOWNLOAD_INCOME,
        {
          responseType: 'blob'
        }
      );

      // Create a URL for the blob 
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'income_details.xlsx');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading income details', err);
      toast.error('Failed to download income details. Please try again.')
    }
  }

  useEffect(() => {
    fetchIncomeDetails();
    return () => {}

  }, []);

  return (
   <DashboardLayout activeMenu="Income">
     <div className='my-5 mx-auto'>
        <div className='grid grid-cols-1 gap-6'>
          <div className=''>
            <IncomeOverView  
              transactions={incomeData}
              onAddIncome={() => setOpenAddIncomeModel(true)}
            />
          </div>

        <IncomeList 
          transactions={incomeData}
          onDelete={(id) => {
            setOpenDeleteAlert({show: true, data: id});
          }}
          onDownload={handleDownloadIncomeDetails}
        />

        </div>

        <Modal 
          isOpen={OpenAddIncomeModel}
          onClose={() => setOpenAddIncomeModel(false)}
          title='Add Income'
        >
          <AddIncomeForm onAddIncome={handleAddIncome} />
        </Modal>

        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({show: false, data: null})}
          title='Delete Income'
        >
          <DeleteAlert 
             content='Are you sure you went to delete this income detail?'
             onDelete={() => deleteIncome(openDeleteAlert.data)}
          />
        </Modal>

     </div>
   </DashboardLayout>
  )
}

export default Income