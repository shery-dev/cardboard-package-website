import MainAppContainer from "@/components/Manipulator/MainAppContainer";

// Avoid static prerender so useSearchParams() in MainAppContainer works at build
export const dynamic = "force-dynamic";

export default function ManipulatorLayout({ children }) {
  return (
    <div className="h-[calc(100vh-68px)] w-full flex flex-col overflow-hidden bg-[#FAF7F2]">
      <MainAppContainer>{children}</MainAppContainer>
    </div>
  );
}
