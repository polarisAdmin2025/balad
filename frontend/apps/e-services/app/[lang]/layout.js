import Header from '@repo/ui/header'

const MainLayout = ({ children }) => {
  return (
    <>
      <Header />
      {children}
    </>
  )
}

export default MainLayout
