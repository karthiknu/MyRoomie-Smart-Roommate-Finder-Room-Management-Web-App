import React from 'react'
import SvgComponent from '../components/AppLogo'

const layout = ({ children }: {
    children: React. ReactNode
}) => {
    return (
        <div>
            <div className='p-6'>
                <SvgComponent />
            </div>
            {children}
        </div>
    )
}
export default layout