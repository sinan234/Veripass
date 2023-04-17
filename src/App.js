import './styles.css';
import React, { useState, useRef, useEffect} from 'react';
import { FaBus } from "react-icons/fa";
import axios from 'axios';
import { BsQrCodeScan } from "react-icons/bs";
import QrScanner from 'qr-scanner';


function StudentInfo({ student, busPassStatus }) {
return (

<div class="bg-purple-100 rounded-lg shadow-lg p-8 mt-10"> <h2 class="text-violet-500 text-3xl font-bold mb-6">Student Details</h2> <h3 class="text-gray-800 text-lg font-semibold mb-4">Buss Pass Status: {busPassStatus}</h3> <div class="bg-white rounded-lg p-4"> <h3 class="text-gray-800 text-lg font-semibold mb-4">Student Name:</h3> <p class="text-gray-600 text-xl font-medium">{student.student_name}</p> </div> <div class="bg-white rounded-lg p-4 mt-4"> <h3 class="text-gray-800 text-lg font-semibold mb-4">Year of Join:</h3> <p class="text-gray-600 text-xl font-medium">{student.year_of_join}</p> </div> <div class="bg-white rounded-lg p-4 mt-4"> <h3 class="text-gray-800 text-lg font-semibold mb-4">Valid Till:</h3> <p class="text-gray-600 text-xl font-medium">{student.valid_till}</p> </div> <div class="bg-white rounded-lg p-4 mt-4"> <h3 class="text-gray-800 text-lg font-semibold mb-4">Boarding Place:</h3> <p class="text-gray-600 text-xl font-medium">{student.boarding_place}</p> </div> </div> ); }
function ErrorMessage() {
return (

<div class="bg-red-100 rounded-lg shadow-lg p-12 mt-10"> <h2 class="text-red-500 text-3xl font-bold mb-6">Error</h2> <p class="text-gray-800 text-lg font-semibold">No Such Pass Alloted</p> <p class="text-gray-800 text-lg font-semibold">Please check your Admission Number and try again</p> </div> ); }
function App() {
const [admissionno, setadmissionno] = useState("");
const [student, setStudent] = useState(null);
const [showInfo, setShowInfo] = useState(false);
const [busPassStatus, setBusPassStatus] = useState("");
const [showScanner, setShowScanner] = useState(false);
const videoRef = useRef();

useEffect(() => {
  if (showScanner) {
    const qrScanner = new QrScanner(videoRef.current, async (data) => {
      console.log('Scanned data:', data);
      setadmissionno(data);
      setShowScanner(false);
      var bodyFormData = new FormData();
      bodyFormData.append('pass_id', data);
      let response = await axios.post('https://app.conext.in/bus_pass/checker/', bodyFormData);
      setBusPassStatus(response.data.Bus_Pass);
      if (response.data.Bus_Pass === "Pass Expired" || response.data.Bus_Pass === "Valid Pass") {
        setStudent(response.data.student);
        setShowInfo(true);
      }
    });

    qrScanner.start();

    return () => {
      qrScanner.destroy();
    };
  }
}, [showScanner]);


const Submit = async () => {
var bodyFormData = new FormData();
bodyFormData.append('pass_id', admissionno);

console.log(admissionno)
let response = await axios.post('https://app.conext.in/bus_pass/checker/', bodyFormData)
console.log(response.data);
setBusPassStatus(response.data.Bus_Pass);
if (response.data.Bus_Pass === "Pass Expired" || response.data.Bus_Pass === "Valid Pass") {
setStudent(response.data.student);
setShowInfo(true);
}
};

const handleScan = async (data) => {
  if (data) {
    console.log('Scanned data:', data);
    setadmissionno(data);
    setShowScanner(false);
    var bodyFormData = new FormData();
    bodyFormData.append('pass_id', data);
    let response = await axios.post('https://app.conext.in/bus_pass/checker/', bodyFormData);
    setBusPassStatus(response.data.Bus_Pass);
    if (response.data.Bus_Pass === 'Pass Expired' || response.data.Bus_Pass === 'Valid Pass') {
      setStudent(response.data.student);
      setShowInfo(true);
    }
  }
};

const handleError = (err) => {
  console.error(err);
};

const openScanner = () => {
  setShowScanner(true);
  const qrScanner = new QrScanner(videoRef.current, handleScan, handleError);
  qrScanner.start();
};



return (

<div className="bg-[#32324d] min-h-screen flex flex-col items-center justify-start overflow-y-auto"> 
{showInfo ?
 ( <StudentInfo student={student} busPassStatus={busPassStatus} /> 
 ) : busPassStatus === "No Such Pass Alloted" ? ( <ErrorMessage /> ) :
  ( <> {showScanner && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" style={{ zIndex: 100 }}>
      <div className="bg-white p-4 rounded-lg" style={{ width: "400px", height: "400px" }}>
        <video ref={videoRef} className="qr-scanner-video" />
      </div>
    </div>
  )}
          <FaBus className='text-white mt-12' size={60} style={{ color: 'white' }} />
           <h1 className='text-white px-4 text-5xl font-bold mt-8'>Veripass</h1> 
           <h2 className='text-white px-4 text-4xl font-semibold mt-8'>Let's get Started</h2> 
           <p className='text-[#FFFFFA] text-base font-[Poppins] items-center p-8 mt-6'>Enter your Admission number or scan QR code to know the status of your bus pass</p> 
           <input className='rounded-lg px-5 py-2 bg-gray-100 focus:bg-white duration-300 peer w-72' type="number" placeholder='Enter your Admission number' required='true' value={admissionno} onChange={e => setadmissionno(e.target.value)} />
            <div className='flex items-center mt-4'>
               <hr className='flex-grow bg-gray-300 border-none h-0.5' />
                <span className='text-white mx-4 font-semibold'>OR</span>
                 <hr className='flex-grow bg-gray-300 border-none h-0.5' />
                  </div> 
            <div onClick={openScanner} className='flex items-center mt-4 border-2 border-white rounded-lg p-4 w-72'>
               <BsQrCodeScan className='text-white mr-2' size={48} style={{ color: 'white' }} />
                <h3 className='text-white text-base font-semibold px-6'>Scan QR code</h3> 
            </div> 
            <button onClick={Submit} className='bg-violet-400 flex justify-center w-72 items-center text-black text-base rounded-lg px-3 py-2 mt-10'>Submit</button>
             </> )} 
             {/* ... Rest of the JSX ... */}
      
             </div> 
             );
         } 
         export default App; 