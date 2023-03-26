import React, { useState, useEffect } from "react";
import { getReq, delReq,postReq } from "../middleware/AxiosApisCall";
import { SuccessAlert, ErrorAlert } from "../middleware/AlertMsg";

function TableDataWithPagination(props) {
  const [tableData, setTableData] = useState();

  const [path, setPath] = useState(props.path);
  const [par, setpar] = useState(props.par);
  const [ComponentName, setComponentName] = useState(props.componentName);
  const [searchData,setSearchData] = useState(props.searchData);
  const [page, setPage] = useState(1);
  const [dataPerPage, setDataPerPage] = useState(10);
  const [metadata, setMetaData] = useState();
  const [maxpagelimit, setMaxPageLimit] = useState();

  const loadTableDate = async () => {
    const response = await getReq(`${path}/Table/${page}/${dataPerPage}`);
    if (response.data.metadata&&response.data.data.length) {
     
      setTableData(response.data.data);
      setMetaData(response.data.metadata);
    } else {
      console.log(response.data);
      setTableData(null);
      setMetaData(null);
    }
  };
  const loadSearchData = async (event) => { //TODO:Submit Search Form
    if(props.reject){
      console.log(searchData.length)
      setTableData(searchData)
        let metadat2={
           count: searchData.length,
           start: 1,
           end: searchData.length,
           page: 1
        }
        setMetaData(metadat2)
    }else{
      console.log("RUN Search Load")
      const response = await postReq(`${path}/Search/${page}/${dataPerPage}`, searchData);
      if (response.data) {
        setTableData(response.data.data);
        setMetaData(response.data.metadata);
      } else {
        props.clear();
       
      }
    }
  };
  const deleteState = async (event) => {
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
  const editClick = (item) => {
    props.editClick(item);
  };


  //TODO:Pagination Functions 
  const previouspage = (item) => {
    if (page > 1) {
      setPage(page - 1);
    }
  };
  const nextpage = () => {
    if (page < maxpagelimit) {
      setPage(page + 1);
    }
  };
  const lastpage = () => {
    console.log(maxpagelimit);
    setPage(maxpagelimit);
  };
  const setdataperpage = (event) => {
    if (event.target.value <= metadata.count && event.target.value > 0) {
      setDataPerPage(event.target.value);
    }
  };

  useEffect(() => {
    if(searchData){
      
    }else{
      loadTableDate();
    }
   
  }, []);
  useEffect(() => {
    console.log(props.searchData)
    if(searchData){
     console.log("🚀 ~ file: TableDataWithPagination.jsx:98 ~ useEffect ~ searchData:", searchData)
     setSearchData(props.searchData)
    }else(
      setSearchData()
    )
   
  }, [props.searchData]);
  
  //TODO:PAnination useEffects
  useEffect(() => {
    if (metadata) {
      if (metadata.count % dataPerPage) {
        setMaxPageLimit(parseInt(metadata.count / dataPerPage) + 1);
      } else {
        setMaxPageLimit(metadata.count / dataPerPage);
      }
      if(dataPerPage>metadata.count){
        setDataPerPage(metadata.count)
      }
    }
  }, [metadata]);
  useEffect(() => {
    if(searchData){
      loadSearchData();
    }else{
      loadTableDate();
    }
  }, [page, dataPerPage,searchData]);

  return (
    <React.Fragment>
      <div className="componet-sub2-title">
        <div className="justi-spacebt">
          <span>
            Total {props.name}: {metadata != null ? metadata.count : 0}
          </span>

          <div className="table-page-nav-btn">
            <div className="table-data-per-page">
              <input
                type="number"
                value={dataPerPage || ""}
                onChange={() => {
                  setdataperpage(event);
                }}
              />
            </div>
            <button
              onClick={() => {
                setPage(1);
              }}
            >
              &lt;&lt;
            </button>
            <button onClick={previouspage}>&lt;</button>
            <span>
              {metadata &&
                `${metadata.start} to ${
                  metadata.start + tableData.length - 1
                } of ${metadata.count}`}
            </span>
            <button onClick={nextpage}>&gt;</button>
            <button onClick={lastpage}>&gt;&gt;</button>
          </div>
        </div>
      </div>
      <div className="table_container-div">
        <table>
          <tbody>
            <tr>
              { tableData != null ? (
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
              {tableData != null && ((!('error' in tableData[0]))&&<th>Actions</th>)}
            </tr>
                                                                           
            {tableData != null ? (
              tableData.map((item, index) => {
                // console.log("🚀 ~ file: tableData.jsx:111 ~ tableData ~ item", item)
                return (
                  <tr key={item._id}>
                    {Object.keys(item)
                      .filter((i) => i !== "_id")
                      .map((input, index) => {
                        return <td className={(input=="error")?"red-text":""} key={index}>{item[input]}</td>;
                      })}

                    {par != item._id ? (
                      <td>
                        <button
                          className="btn_edit"
                          onClick={() => editClick(item)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn_delete"
                          onClick={() => deleteState(item._id)}
                        >
                          Delete
                        </button>
                      </td>
                    ) : (
                      <td></td>
                    )}
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

export default TableDataWithPagination;
