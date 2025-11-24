'use client'

//import file css toàn cục cho client page
import './client.css'

export default function RootClientLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>){
  return(
    <>
        {/* phần header */}

        {/* phần body */}
        {children}
        
        {/* phần footer */}
    </>
  )
}