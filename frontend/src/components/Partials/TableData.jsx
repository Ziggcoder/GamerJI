import React, { useState, useEffect } from "react";
import { getReq, delReq } from "../middleware/AxiosApisCall";

import { SuccessAlert, ErrorAlert } from "../middleware/AlertMsg" ;

function TableData(props) {
  
  const [tableData, setTableData] = useState();
  const [path, setPath] = useState(props.path);
  const [par, setpar] = useState(props.par);
     console.log('this is par:',par);

  const loadTableDate = async () => {
    const response = await getReq(path);
    if(response.data.length){
      console.log(response.data)
      setTableData(response.data);
    }else{
      console.log(response.data)
      setTableData(null);
    }
    
  };
const editClick=((item)=>{
    props.editClick(item);
  })
  useEffect(() => {
    loadTableDate();
  }, []);

  const deleteState = async (event) => {
    console.log("🚀 ~ file: TableData.jsx:19 ~ deleteState ~ event", event);
    // props.parentFunction();
    const response = await delReq(path, event);
    if (response.success) {
      loadTableDate();
      SuccessAlert({
        title: "Data Deleted",
        message: `${path} : Delete Succesfully `,
      });
    } else {
      ErrorAlert({
        title: `${path} Delete: Error`,
        message: response.msg,
      });
    }
  };
  

return (
    <React.Fragment>
      <div className="componet-sub2-title">
        <span>
          Total {path}: {tableData != null ? tableData.length : 0}
        </span>
      </div>
      <div className="table_container-div">
        <table>
          <tbody>
            <tr>
              {tableData != null ? (
                Object.keys(tableData[0]).map(
                  (key) =>
                    key != ("_id" || null) && (
                      
                      <th key={key}>
                        <span style={{ textTransform: "capitalize" }}>
                          {key}
                        </span>
                      </th>
              
                    )
                )
              ) : (
                <td></td>
              )}
              {tableData != null && <th>Actions</th>}
            </tr>

            {
              tableData != null ? (
              tableData.map((item, index) => {
                // console.log("🚀 ~ file: TableData.jsx:111 ~ TableData ~ item", item)
                return (
                  <tr key={item._id}>
                    {Object.keys(item)
                   
                      .filter((i) => i !== "_id")
                      .map((input, index) => {
                        return <td key={index}>{item[input]}</td>;
                      })}

                   { par !=item._id ?(<td>
                      <button
                        className="btn_edit"
                        onClick={() =>editClick(item)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn_delete"
                        value={item._id}
                        onClick={() => deleteState(item._id)}
                      >
                        Delete
                      </button>
                    </td>):(<td></td>)
                  }
                  </tr>
                );
              })
            ) : (
              <tr>
                <td> Data Not Found </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </React.Fragment>
  );
}

export default TableData;
