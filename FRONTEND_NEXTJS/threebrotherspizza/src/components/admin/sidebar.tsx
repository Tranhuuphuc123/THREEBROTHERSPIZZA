import Image from 'next/image'
import Link from 'next/link'

//su dung icon cua lib fontawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faHouse, faBox, faCartArrowDown, faUser,
        faRightToBracket
        } from '@fortawesome/free-solid-svg-icons'

export default function Sidebar(){
    return (
        <>
        <div className="h-100">
                <div className="sidebar-logo">
                    <Link href="#"> 
                        <Image 
                            src="/IZJP.gif" 
                            width={50}
                            height={50}
                            style={{borderRadius: "50%"}}
                            alt='Logo' /> GAME DESIGN
                    </Link>
                </div>
                {/* <!-- Sidebar Navigation --> */}
                <ul className="sidebar-nav">
                    <li className="sidebar-header">
                        Tools & Components
                    </li>
                    <li className="sidebar-item">
                        <Link href="#" className="sidebar-link">
                            <FontAwesomeIcon icon={faHouse} className="fa-fw" />
                            &nbsp; Dashboard
                        </Link>
                    </li>
                    <li className="sidebar-item">
                        <Link href="/admin/products" className="sidebar-link collapsed" data-bs-target="#pages"
                            aria-expanded="false" aria-controls="pages">
                             <FontAwesomeIcon icon={faBox} className="fa-fw" />
                           &nbsp; Products
                        </Link>
                    </li>
                    <li className="sidebar-item">
                        <Link href="#" className="sidebar-link collapsed"  data-bs-target="#dashboard"
                            aria-expanded="false" aria-controls="dashboard">
                             <FontAwesomeIcon icon={faCartArrowDown} className="fa-fw" />
                            &nbsp; Cart
                        </Link>
                    </li>
                    <li className="sidebar-item">
                        {/* data-bs-toggle="collapse": mũi tên chỉa xuống sổ xuống */}
                        <Link href="#" className="sidebar-link collapsed"  data-bs-target="#auth"
                            aria-expanded="false" aria-controls="auth">
                            <FontAwesomeIcon icon={faUser} className="fa-fw" />
                            &nbsp; Account
                        </Link>
                    </li>
                </ul>
            </div>
        </>
    )
}        