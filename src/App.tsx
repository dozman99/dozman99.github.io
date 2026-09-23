import { Route, Routes } from "react-router-dom"
import { Layout } from "@/components/layout/Layout"
import Home from "@/pages/Home"
import About from "@/pages/About"
import Flagships from "@/pages/Flagships"
import FlagshipDetail from "@/pages/FlagshipDetail"
import Experience from "@/pages/Experience"
import Projects from "@/pages/Projects"
import NowNext from "@/pages/NowNext"

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/flagships" element={<Flagships />} />
        <Route path="/flagships/:slug" element={<FlagshipDetail />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/now-next" element={<NowNext />} />
      </Route>
    </Routes>
  )
}
