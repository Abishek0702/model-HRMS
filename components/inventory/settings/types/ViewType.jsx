import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Spinner } from 'components';
import { alertService } from 'services/alert.service';
import Pagination from 'next-pagination'
import Modal from 'react-bootstrap/Modal';
import { inventoryService } from 'services/inventory.service';
import TypeForm from './AddEdit';

const ViewType = () => {

    const [types, setTypes] = useState(null);
    const [totalcount, setCount] = useState(0);
    const [show, setShow] = useState({ isShow: false, type_id: 0, type_name: '' });
    const [viewType, setViewType] = useState({ name: '', id: '' });
    const [updateUser, setUpdateUser] = useState("")
    const router = useRouter();
    const sizelist = [10, 15, 20, 25];

    var page = router.query.page || 1;
    var size = router.query.size || 10;
    var search = router.query.search || '';

    useEffect(() => {

        handleAdminList(page, size, search);

    }, []);

    const handleAdminList = (page, size, search) => {
        setShow({ isShow: false })
        inventoryService.getAll(page, size, search)
            .then((x) => {
                if (typeof x.posts !== 'undefined') { setTypes(x.posts); }
                if (typeof x.numRows !== 'undefined') { setCount(x.numRows); }
            });
    }

    const handleUpdate = (user) => {
        setShow({ isShow: true })
        setUpdateUser(user)
    }

    // function getSearch() {
    //     router.push(`/inventory/settings?&search=${search}`)
    // }

    function typeRemove(id) {
        if (confirm("Confirm to delete id " + "" + id)) {
            return inventoryService.deleteType(id)
                .then(data => {
                    alertService.success(data.message)
                    callback()
                })
                .catch((error) => {
                    alertService.error(error.message)
                })
        }
    }
    function callback() {
        handleAdminList(page, size, search)
    }

    return (
        <div className='row mt-2'>
            <div className='col-lg-8'>
                <div className="card shadow-none">

                    <nav className="navbar  navbar-expand-lg navbar-dark2  bg-primary22">
                        <span className="navbar-brand text-white "><i class="fas fa-network-wired"></i> Types</span>
                        <ul className="navbar-nav mr-auto">
                        </ul>
                        {/* <div className="form-inline   navbar-expand-lg">
                            <div className="input-group" data-widget="sidebar-search">
                                <input className="form-control" type="search" placeholder="Search" aria-label="Search"
                                    onChange={e => { setSearch(e.target.value) }}
                                    onKeyUp={e => {
                                        if (e.key === 'Enter') {
                                            getSearch()
                                        }
                                    }} />
                                <div className="input-group-append">
                                    <button className="btn btn-success" onClick={() => getSearch()}>
                                        <i className="fas fa-search fa-fw"></i>
                                    </button>
                                </div>
                            </div>
                        </div> */}
                    </nav>

                    <div className="card-body p-0">
                        <table className="table table-striped ">
                            <thead className='bg-primary2 text-white'>
                                <tr>
                                    <th style={{ width: 'auto' }}>S.NO</th>
                                    <th style={{ width: 'auto' }}>Type </th>
                                    <th style={{ width: 'auto' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {types && types.map(user =>
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.name}</td>
                                        <td className=''>
                                            <span style={{ cursor: "pointer" }} onClick={() => setViewType({ isShow: true, userName: user.name, userID: user.id })}><i className="fas fa-eye text-success "></i></span>
                                            <span style={{ cursor: "pointer" }} onClick={() => { handleUpdate(user) }}><i className="far fa-edit text-warning px-3"></i></span>
                                            <span style={{ cursor: "pointer" }} onClick={() => { typeRemove(user.id) }}><i className="fas fa-trash  text-danger "></i> </span>
                                        </td>
                                    </tr>
                                )}
                                {!types &&
                                    <tr>
                                        <td colSpan="3">
                                            <Spinner />
                                        </td>
                                    </tr>
                                }
                                {types && !types.length &&
                                    <tr>
                                        <td colSpan="3" className="text-center">
                                            <div className="p-2">No Types to Display</div>
                                        </td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                        {totalcount && <Pagination total={totalcount} sizes={sizelist} />}
                    </div>
                </div>
            </div>


            <div className='col-lg-4'>
                <div className='card shadow-none'>
                    <div className='card-header'>
                        <nav className="navbar  navbar-expand-lg navbar-dark2  bg-primary22">
                            <span className="navbar-brand text-white ">Add Types</span>
                        </nav>
                    </div>
                    <div className='card-body'>
                        <TypeForm callback={callback} />
                    </div>
                </div>
            </div>




            <Modal show={show.isShow} onHide={() => setShow({ ...show, isShow: false })} size='md' backdrop="static">
                <Modal.Header className='bg-primary text-white d-flex align-items-center p-2'>
                    <Modal.Title >Update</Modal.Title>
                    <button className='close-btn bg-transparent text-white' style={{ border: "none", outline: "none" }} onClick={() => setShow({ isShow: false })}><i className='fas fa-times'></i></button>
                </Modal.Header>
                <Modal.Body>
                    <div className='card-body'>
                        <TypeForm type={updateUser} callback={callback} />

                    </div>

                </Modal.Body>
            </Modal>


            <Modal show={viewType.isShow} onHide={() => setViewType({ isShow: false })} size='md' backdrop="static">
                <Modal.Header className='bg-primary text-white p-2 px-3 d-flex align-items-center'>
                    <Modal.Title>Type</Modal.Title>
                    <button className='close-btn bg-transparent text-white' style={{ border: "none", outline: "none" }} onClick={() => setViewType({ isShow: false })}><i className='fas fa-times'></i></button>
                </Modal.Header>
                <Modal.Body>
                    <div className="table-responsive">
                        <table className="table font-weight-bold">
                            <tr> <td style={{ width: '30%' }} >Types</td><td style={{ width: '10%' }}>:</td><td style={{ width: '50%' }}>{viewType.userName}</td></tr>

                        </table>
                    </div>
                </Modal.Body>
            </Modal>
        </div >
    )
}

export default ViewType
