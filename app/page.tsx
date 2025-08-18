import dynamic from "next/dynamic"

const Accordion = dynamic(() => import("@/app/component/ui/Accordion/Accordion"), {});


export default function Home() {
    return (
        <>
            <Accordion/>
        </>
    );
}
