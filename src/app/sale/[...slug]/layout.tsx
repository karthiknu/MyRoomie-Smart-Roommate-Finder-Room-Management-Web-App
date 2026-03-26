import React from 'react';
import SvgComponent from '@/app/components/AppLogo';

const Layout = ({children} : {
    children : React.ReactNode
}) => {
    return(
        <div className="p-6">
            <SvgComponent />
            <div className='mt-8'>
                {children}
            </div>
        </div>
    )
}

export default Layout;
