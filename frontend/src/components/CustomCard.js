import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


export function CustomCard({title, icon, text, bgColor, titleColor, textColor, fontSize, children}){

    return (
        <div className="flex-grow m-2 p-4" style={{backgroundColor: bgColor, borderRadius:20}}>
            <div>
                <div className="flex" style={{color: titleColor, fontSize: fontSize}}>
                    <FontAwesomeIcon className="mr-2" icon={icon}/>
                    <p className="font-semibold">
                        {title}
                    </p>
                </div>
                <div style={{color: textColor}}>
                    {text}
                </div>
                <div className="flex flex-col lg:flex-row lg:flex-wrap">
                    {children}
                </div>
            </div>
        </div>
    )
}

export function PrimaryCard({title, icon, text, children}){
    return (
        <div>
            <CustomCard title={title} icon={icon} text={text} bgColor={"#ffffff"} titleColor={"#000000"} textColor={"#000000"} fontSize={'20px'}>
                { children }
            </CustomCard>
        </div>
    )
}

export function SecondaryCard({title, icon, text, children}){
    return (
        <CustomCard title={title} icon={icon} text={text} bgColor={"#F6F8FA"} titleColor={"#B2B2B2"} textColor={"#000000"} fontSize={'16px'}>
            { children }
        </CustomCard>
    )
}