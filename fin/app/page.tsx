/// <reference types="next" />
import Image from "next/image";
import PremiumAuthSplit from "./components/PremiumAuthSplit";
import RegistrationFormWithImages from "./components/RegistrationFormWithImages";



export default function Home() {
  return (
   <main>

        <div>
            <PremiumAuthSplit />
        </div>
        <div>
            <RegistrationFormWithImages />
        </div>
         
      </main>
    
  );
}
