'use client'

import FormContainer from "@/components/FormContainer"
import RequestForm from "@/components/RequestQuotes/RequestForm"

const QuotePage = () => {
    return (
        <main className="min-h-screen bg-white flex flex-col">
            <section className="flex-1 pt-4 pb-8 lg:pb-10 flex flex-col min-h-0">
                <FormContainer
                    heading="Create the Perfect Package Today"
                    introPara="Your Packaging, Your Way: Request a Quote and See How We Can Bring Your Ideas to Life with Custom Solutions That Perfectly Align with Your Brand's Goals. Our experts are ready to craft custom solutions that match your specific style, materials, and finishing touches. Discover how our personalized approach ensures your packaging stands out and perfectly complements your product."
                    imgSrc="/img/cardboards_main_image.png"
                    formComp={<RequestForm />}
                />
            </section>
        </main>
    )
}

export default QuotePage