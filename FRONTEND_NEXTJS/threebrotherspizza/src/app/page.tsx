import {redirect} from 'next/navigation'

//dung redirect trong nextjs de chuyen huong thang trang client
export default function Home(){
  redirect('/client')
}