import React, { useState } from 'react';
import { ArrowLeft, DollarSign, TrendingUp, TrendingDown, CreditCard, FileText, Clock, X, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

interface EarningsProps {
  onBack: () => void;
}

export const EarningsView: React.FC<EarningsProps> = ({ onBack }) => {
  const [balance, setBalance] = useState(150.00);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [transactions, setTransactions] = useState([
    { id: 1, title: 'Library Assistant', date: 'Today, 2:00 PM', amount: 30, type: 'hourly', isWithdrawal: false },
    { id: 2, title: 'Red Bull Ambassador', date: 'Yesterday', amount: 50, type: 'fixed', isWithdrawal: false },
    { id: 3, title: 'Data Entry Project', date: 'Oct 12', amount: 70, type: 'task', isWithdrawal: false },
  ]);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    
    // Add space every 4 digits for readability
    const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const transferAmount = parseFloat(amount);
    
    if (cardNumber.replace(/\s/g, '').length < 16 || !amount || isNaN(transferAmount)) return;
    
    if (transferAmount > balance) {
        alert("Insufficient funds");
        return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      // Update balance and transactions
      setBalance(prev => prev - transferAmount);
      const newTransaction = {
          id: Date.now(),
          title: `Transfer to *${cardNumber.slice(-4)}`,
          date: 'Just now',
          amount: transferAmount,
          type: 'transfer',
          isWithdrawal: true
      };
      setTransactions(prev => [newTransaction, ...prev]);
      
      setIsLoading(false);
      setIsSuccess(true);
      
      // Reset and close after success
      setTimeout(() => {
        setIsSuccess(false);
        setShowTransferModal(false);
        setCardNumber('');
        setAmount('');
      }, 2000);
    }, 1500);
  };

  return (
    <div className="pb-24 pt-4 px-4 space-y-6 min-h-screen bg-gray-50 fixed inset-0 z-50 overflow-y-auto animate-fade-in">
       {/* Header */}
       <div className="flex items-center gap-3">
          <button 
            onClick={onBack} 
            className="p-2 -ml-2 rounded-full hover:bg-gray-200 text-gray-600 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Earnings</h1>
       </div>

        {/* Total Balance Card */}
        <Card className="bg-gradient-to-br from-violet-600 to-indigo-600 text-white border-none p-6 shadow-xl shadow-indigo-200">
           <div className="flex justify-between items-start mb-2">
              <span className="text-indigo-100 font-medium text-sm">Available Balance</span>
              <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                 <DollarSign size={20} className="text-white" />
              </div>
           </div>
           <h2 className="text-4xl font-bold mb-6">${balance.toFixed(2)}</h2>
           
           <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setShowTransferModal(true)}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-md py-2.5 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2"
              >
                 <CreditCard size={16} /> Karta çıxarış
              </button>
               <button 
                 onClick={() => setShowDetailsModal(true)}
                 className="bg-white text-indigo-600 py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
               >
                 <FileText size={16} /> Details
              </button>
           </div>
        </Card>

        {/* Analytics / Chart */}
        <div className="space-y-2">
            <h3 className="font-bold text-gray-900">Weekly Activity</h3>
            <Card className="p-4">
            <div className="flex items-end justify-between h-32 gap-2 mt-2">
                {[40, 65, 30, 80, 50, 90, 45].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                        <div 
                        className={`w-full rounded-t-lg transition-all duration-500 ${i === 5 ? 'bg-indigo-600' : 'bg-indigo-100'}`}
                        style={{ height: `${h}%` }}
                        ></div>
                        <span className="text-xs text-gray-400 font-medium">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                        </span>
                    </div>
                ))}
            </div>
            </Card>
        </div>

        {/* Recent Transactions */}
        <div className="space-y-4">
           <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-900">History</h3>
           </div>

           {transactions.length > 0 ? (
             transactions.map(t => (
                <Card key={t.id} className="p-4 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.isWithdrawal ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                         {t.isWithdrawal ? <TrendingDown size={20} /> : <TrendingUp size={20} />}
                      </div>
                      <div>
                         <h4 className="font-bold text-gray-900 text-sm">{t.title}</h4>
                         <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                            <Clock size={10} /> {t.date}
                         </div>
                      </div>
                   </div>
                   <span className={`font-bold text-lg ${t.isWithdrawal ? 'text-red-600' : 'text-gray-900'}`}>
                      {t.isWithdrawal ? '-' : '+'}${typeof t.amount === 'number' ? t.amount.toFixed(2) : t.amount}
                   </span>
                </Card>
             ))
           ) : (
             <div className="text-center py-8 text-gray-500">
               No transactions found
             </div>
           )}
        </div>

        {/* Transfer Modal */}
        {showTransferModal && (
          <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
             {/* Backdrop */}
             <div 
               className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
               onClick={() => !isLoading && !isSuccess && setShowTransferModal(false)}
             ></div>
             
             {/* Modal Content */}
             <div className="bg-white w-full max-w-sm rounded-t-2xl sm:rounded-2xl p-6 relative z-10 animate-fade-in shadow-2xl">
                {!isSuccess ? (
                  <>
                    <div className="flex justify-between items-center mb-6">
                       <h3 className="text-xl font-bold text-gray-900">Card Transfer</h3>
                       <button 
                         onClick={() => setShowTransferModal(false)}
                         disabled={isLoading}
                         className="p-1 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                       >
                         <X size={24} />
                       </button>
                    </div>
                    
                    <form onSubmit={handleTransfer} className="space-y-5">
                       {/* Card Number Input */}
                       <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                          <div className="relative">
                             <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <CreditCard size={20} />
                             </div>
                             <input 
                               type="text" 
                               value={cardNumber}
                               onChange={handleCardNumberChange}
                               placeholder="0000 0000 0000 0000"
                               className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none font-mono text-lg"
                               maxLength={19} // 16 digits + 3 spaces
                               required
                             />
                          </div>
                       </div>

                       {/* Amount Input */}
                       <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                          <div className="relative">
                             <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-900 font-bold">
                                $
                             </div>
                             <input 
                               type="number" 
                               value={amount}
                               onChange={(e) => setAmount(e.target.value)}
                               placeholder="0.00"
                               className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-lg font-bold"
                               required
                               min="0.01"
                               step="0.01"
                               max={balance}
                             />
                             <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <button 
                                  type="button"
                                  onClick={() => setAmount(balance.toFixed(2))}
                                  className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded"
                                >
                                  MAX
                                </button>
                             </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-2 text-right">Available Balance: ${balance.toFixed(2)}</p>
                       </div>

                       <Button 
                         type="submit" 
                         fullWidth 
                         size="lg"
                         disabled={isLoading || parseFloat(amount) > balance || parseFloat(amount) <= 0}
                         className="bg-indigo-600 hover:bg-indigo-700 text-white mt-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                       >
                         {isLoading ? 'Processing...' : 'Transfer Funds'}
                       </Button>
                    </form>
                  </>
                ) : (
                  <div className="py-8 flex flex-col items-center text-center animate-fade-in">
                     <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                        <CheckCircle2 size={32} />
                     </div>
                     <h3 className="text-xl font-bold text-gray-900 mb-2">Transfer Successful!</h3>
                     <p className="text-gray-500 mb-6">
                        You have successfully transferred <span className="font-bold text-gray-900">${parseFloat(amount).toFixed(2)}</span> to card ending in <span className="font-mono text-gray-900">{cardNumber.slice(-4)}</span>.
                     </p>
                     <div className="w-full p-4 bg-gray-50 rounded-xl border border-gray-100 mb-6">
                        <div className="flex justify-between items-center text-sm mb-2">
                           <span className="text-gray-500">Transaction ID</span>
                           <span className="font-mono text-gray-900">TRX-{Math.floor(Math.random() * 1000000)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                           <span className="text-gray-500">Date</span>
                           <span className="text-gray-900">{new Date().toLocaleString()}</span>
                        </div>
                     </div>
                  </div>
                )}
             </div>
          </div>
        )}

        {/* Details Modal */}
        {showDetailsModal && (
          <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
             <div 
               className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
               onClick={() => setShowDetailsModal(false)}
             ></div>
             <div className="bg-white w-full max-w-sm rounded-t-2xl sm:rounded-2xl p-6 relative z-10 animate-fade-in shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-xl font-bold text-gray-900">Wallet Details</h3>
                   <button 
                     onClick={() => setShowDetailsModal(false)}
                     className="p-1 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                   >
                     <X size={24} />
                   </button>
                </div>

                {/* Virtual Card Representation */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-5 text-white mb-6 shadow-lg">
                    <div className="flex justify-between items-start mb-8">
                        <span className="font-mono text-xs opacity-70">Virtual Card</span>
                        <span className="font-bold italic">VISA</span>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <div className="font-mono text-lg tracking-widest">
                            {showCardNumber ? '4532 1521 8569 4289' : '**** **** **** 4289'}
                        </div>
                        <button 
                          onClick={() => setShowCardNumber(!showCardNumber)}
                          className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-white/80 hover:text-white"
                        >
                            {showCardNumber ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    
                    <div className="flex justify-between items-end">
                        <div>
                            <div className="text-[10px] opacity-70 uppercase">Card Holder</div>
                            <div className="text-sm font-medium">Guest Student</div>
                        </div>
                        <div>
                             <div className="text-[10px] opacity-70 uppercase">Expires</div>
                            <div className="text-sm font-medium">12/28</div>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                        <span className="text-gray-600 text-sm">Account Status</span>
                        <span className="text-green-600 font-bold text-sm flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div> Active
                        </span>
                    </div>
                     <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                        <span className="text-gray-600 text-sm">Monthly Limit</span>
                        <span className="text-gray-900 font-bold text-sm">$2,500.00</span>
                    </div>
                    
                    <h4 className="font-bold text-gray-900 pt-2">Income Sources</h4>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Hourly Jobs</span>
                            <span className="font-medium text-gray-900">45%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                            <div className="bg-indigo-500 h-2 rounded-full" style={{width: '45%'}}></div>
                        </div>

                         <div className="flex justify-between text-sm mt-2">
                            <span className="text-gray-500">Fixed Projects</span>
                            <span className="font-medium text-gray-900">35%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                            <div className="bg-purple-500 h-2 rounded-full" style={{width: '35%'}}></div>
                        </div>

                         <div className="flex justify-between text-sm mt-2">
                            <span className="text-gray-500">Micro-Tasks</span>
                            <span className="font-medium text-gray-900">20%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                            <div className="bg-blue-400 h-2 rounded-full" style={{width: '20%'}}></div>
                        </div>
                    </div>
                </div>
             </div>
          </div>
        )}
    </div>
  );
};