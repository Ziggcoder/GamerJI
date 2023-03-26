import React, { useState } from "react";
import { postReq,patchReq } from "../middleware/AxiosApisCall";
import { SuccessAlert, ErrorAlert } from "../middleware/AlertMsg"; //1
import TableData from "../Partials/TableData"; //2
import { useNavigate } from "react-router-dom";
function Category() {
  const navigate=useNavigate();
  const ComponentName="Category"
  const path = "Category";
  const [inputs, setInputs] = useState({});
  const [tableRefresh, setTableRefresh] = useState(0); //3
  const[par, setPar] = useState()
  
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if(par) {
      console.log('this id par'+par)
      const response = await patchReq(path, inputs,par);
      console.log("🚀 ~ file: Category.jsx:23 ~ handleSubmit ~ response:", response)
      if (response.success) {
        setPar()
        setTableRefresh(tableRefresh+1);//4
        setInputs({});//5
        SuccessAlert({ title: ` ${ComponentName}`,
        message: ` ${ComponentName} Updated successfully`, });
      } else {
        setPar();
        setTableRefresh(tableRefresh + 1); //4
        setInputs({});
        ErrorAlert({title: ` ${ComponentName}`, message: response.msg });
      }

    } 
    
    else {
      const response = await postReq(path, inputs);
      if (response.success) {
        setTableRefresh(tableRefresh + 1); //4
        setInputs({}); //5
        SuccessAlert({
          title: ` ${ComponentName}`,
          message: ` ${ComponentName} Added successfully`,
        });
      } else {
        ErrorAlert({ title: ` ${ComponentName}`, message: response.msg });
      }
    }
  };
  
  const editClick=(pid)=>{
    setPar(pid._id)
    setInputs(pid) 
    console.log('this is input ' ,inputs);
  }


  return (
    <React.Fragment>
       <div className="add-user-container">
       <div className="componet-sub-title">
       
         <span>
           {par
             ? `Update ${ComponentName} Details`
             : `Add ${ComponentName} Details`}
         </span>
       </div>
       <form className="flex-col" onSubmit={handleSubmit}>
         <div className="input-lable-v-div">
           <label htmlFor="name">Name</label>
           <input
             type="text"
             name="name"
             value={inputs.name || ""}
             onChange={handleChange}
             required
           />
         </div>
         <div className="input-lable-v-div">
           <label htmlFor="description">Description</label>
           <input
             type="text"
             name="description"
             value={inputs.description || ""}
             onChange={handleChange}
             required
           />
         </div>
         <div className="input-lable-v-div">
           <label htmlFor="keyword">Keywords</label>
           <input
             type="text"
             name="keyword"
             value={inputs.keyword || ""}
             onChange={handleChange}
           />
         </div>

         <div className="input-lable-h-div">
           <button className="submit-btn" type="submit">
             {par ? "Update" : "Save"}
           </button>
         </div>
       </form>
     </div>
       <div>
        <TableData path={path} key={tableRefresh}   editClick={editClick}/>
      </div>
    </React.Fragment>
  );


}

export default Category;
