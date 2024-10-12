'use client'
import Image from 'next/image'
import { useTheme } from 'next-themes'

import SwitchTheme from '@/components/SwitchTheme'
import logoLight from '@/assets/logo-light-mode.svg'
import logoDark from '@/assets/logo-dark-mode.svg'

const Header = () => {
  const { theme } = useTheme()
  return (
    <header className="flex pt-42px pb-31px justify-between items-center">
      {theme === 'dark' ? (
        <Image src={logoDark} alt="logo" />
      ) : (
        <Image src={logoLight} alt="logo" />
      )}
      <SwitchTheme />
    </header>
  )
}

export default Header
