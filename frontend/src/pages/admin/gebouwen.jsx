import React from 'react'
import { CustomButton } from '@/components/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons'


export default function Buildings() {

    const building_name = "Testgebouw"

    return (
        <main class='h-screen p-12 flex flex-col justify-between color-bg-light-secondary'>
            
            {/* Detail view */}
            <div class={"mt-3 mb-10 text-gray-800 color-bg-light-primary min-w-full w-fit rounded-lg p-5"}>
                <p class={"font-bold text-xs mb-6"}>Details</p>

                <div class={'flex flex-row'}>
                    <h1 class={"text-xl font-bold"}>{building_name}</h1>
                    <div class={'grow'} />
                    <CustomButton handle="Bewerken" icon={faPenToSquare} backgroundColor="color-done" foregroundColor="color-good" onClick={() => {console.log("click")}} />
                    <CustomButton handle="Verwijderen" icon={faTrash} backgroundColor="color-done" foregroundColor="color-good" onClick={() => {console.log("click")}} />
                </div>

                {/* Grid */}
                <div class={"grid grid-cols-4 gap-4 auto-cols-max"}>

                    {/* Left column */}
                    <div>

                        {/* Verantwoordelijke */}
                        <div class={"mt-3 mb-10 text-gray-800 bg-gray-200 min-w-full w-fit rounded-lg p-5"}>
                            {/* <FontawesomeIcon icon={faCoffee} /> */}
                            <h1>Verantwoordelijke</h1>
                            <p>Bob bob bob</p>
                            <a href={"https://www.youtube.com/watch?v=dQw4w9WgXcQ"} class={"text-gray-500 dark:text-gray-400"}>Stuur bericht</a>
                        </div>                        

                        {/* Locatie */}
                        <div class={"mt-3 mb-10 text-gray-800 bg-gray-200 min-w-full w-fit rounded-lg p-5"}>
                            <h1>Locatie</h1>
                            {/* <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2509.587975530675!2d3.7129469138458626!3d51.02376029806303!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c373e9df939131%3A0x5dafecb1e5931bbb!2sS9!5e0!3m2!1snl!2sbe!4v1679874569362!5m2!1snl!2sbe" width="200" height="200" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe> */}
                        </div>

                    </div>

                    {/* Right column */}
                    <div class={"col-span-3"}>
                        
                        {/* Photos */}
                        <div class={"mt-3 mb-10 text-gray-800 bg-gray-200 min-w-full w-fit rounded-lg p-5"}>
                            <h1>Foto's</h1>
                            {/* Photos */}
                            <div class={"mt-3 mb-10 text-gray-800 bg-white min-w-full w-fit rounded-lg p-5"}>
                                <h1>Binnen</h1>
                                <div class={'flex flex-row'}>
                                    <div class={"mt-3 mb-10 mx-6 text-gray-800 bg-gray-200 rounded-lg p-5"} stype={{height: '100px'}}>*foto*</div>
                                    <div class={"mt-3 mb-10 mx-6 text-gray-800 bg-gray-200 rounded-lg p-5"} stype={{height: '100px'}}>*foto*</div>
                                    <div class={"mt-3 mb-10 mx-6 text-gray-800 bg-gray-200 rounded-lg p-5"} stype={{height: '100px'}}>*foto*</div>
                                    <div class={"mt-3 mb-10 mx-6 text-gray-800 bg-gray-200 rounded-lg p-5"} stype={{height: '100px'}}>*foto*</div>
                                    <div class={"mt-3 mb-10 mx-6 text-gray-800 bg-gray-200 rounded-lg p-5"} stype={{height: '100px'}}>*foto*</div>
                                </div>
                            </div>
                            {/* Photos */}
                            <div class={"mt-3 mb-10 text-gray-800 bg-white min-w-full w-fit rounded-lg p-5"}>
                                <h1>Buiten</h1>
                                <div class={'flex flex-row'}>
                                    <div class={"mt-3 mb-10 mx-6 text-gray-800 bg-gray-200 rounded-lg p-5"} stype={{height: '100px'}}>*foto*</div>
                                    <div class={"mt-3 mb-10 mx-6 text-gray-800 bg-gray-200 rounded-lg p-5"} stype={{height: '100px'}}>*foto*</div>
                                    <div class={"mt-3 mb-10 mx-6 text-gray-800 bg-gray-200 rounded-lg p-5"} stype={{height: '100px'}}>*foto*</div>
                                    <div class={"mt-3 mb-10 mx-6 text-gray-800 bg-gray-200 rounded-lg p-5"} stype={{height: '100px'}}>*foto*</div>
                                    <div class={"mt-3 mb-10 mx-6 text-gray-800 bg-gray-200 rounded-lg p-5"} stype={{height: '100px'}}>*foto*</div>
                                </div>
                            </div>
                        </div>
                        {/* Photos */}
                        <div class={"mt-3 mb-10 text-gray-800 bg-gray-200 min-w-full w-fit rounded-lg p-5"}>
                            <h1>Opmerkingen</h1>
                            <div class={"mt-3 mb-10 text-gray-800 bg-white min-w-full w-fit rounded-lg p-5"}>
                                <h3 class={"italic font-bold"}>Kees</h3>
                                <p>Het was wel ok</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            

        </main>
        
    )
}
