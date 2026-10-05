import { Navigate, Route, Routes, useLocation } from "react-router-dom"
import { Layout } from "@/components/layout/Layout"
import Home from "@/pages/Home"
import About from "@/pages/About"
import FlagshipDetail from "@/pages/FlagshipDetail"
import Experience from "@/pages/Experience"
import Projects from "@/pages/Projects"
import NowNext from "@/pages/NowNext"
import NotFound from "@/pages/NotFound"

// Flagship stories moved onto /projects; keep old links (and their #slug) working.
function FlagshipsMoved() {
  const { hash } = useLocation()
  return <Navigate to={`/projects${hash}`} replace />
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/flagships" element={<FlagshipsMoved />} />
        <Route path="/flagships/:slug" element={<FlagshipDetail />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/now-next" element={<NowNext />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
