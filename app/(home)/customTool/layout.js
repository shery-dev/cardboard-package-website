import MainAppContainer from "@/components/Manipulator/MainAppContainer";

// Avoid static prerender so useSearchParams() in MainAppContainer works at build
export const dynamic = "force-dynamic";

export default function ManipulatorLayout({ children }) {
  return (
    <div className="min-h-[calc(90vh-3.5rem+5px)] h-full flex flex-col overflow-hidden pt-[2vh]">
      <MainAppContainer>{children}</MainAppContainer>
    </div>
  );
}
