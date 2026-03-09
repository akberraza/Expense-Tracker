const xlsx = require("xlsx");
const Expense = require("../models/Expense.js");

// Add Expense Source
exports.addExpense = async(req, res) => {

    const userId = req.user.id;

    try {
        const {icon, category, amount, date} = req.body;

        //  Validation: Check for missing fields
        if(!category || !amount || !date){
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const newExpense = new Expense({
            userId,
            icon,
            category,
            amount,
            date: new Date(date)
        });

        await newExpense.save();
        res.status(200).json(newExpense);

    } catch (err) {
        res.status(400).json({
            message: err.message
        })
    }

}

// Get All Expense Source
exports.getAllExpense = async(req, res) => {
    const userId = req.user.id;
    try {
        
        const expense = await Expense.find({userId}).sort({date: -1});
        res.json(expense);

    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

// Delete Expense Source
exports.deleteExpense = async(req, res) => {

    try {
        
        await Expense.findByIdAndDelete(req.params.id);
        res.json({
            message: "Expense deleted Successfully"
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

// Download Execl
exports.downloadExpenseExcel = async(req, res) => {
    const userId = req.user.id;

    try {
        const expense = await Expense.find({userId}).sort({date:-1});

        // Prepare data for Excel
        const data = expense.map((item)=> ({
            category: item.category,
            Amount: item.amount,
            Date: item.date
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb,ws, "Expense");
        xlsx.writeFile(wb, "expense.xlsx");
        res.download('expense.xlsx');

    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}
