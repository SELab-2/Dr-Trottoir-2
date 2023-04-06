import Image from 'next/image'

export function ProfilePicture({srcPath, width, height}){
    
    return (
        <div className="relative m-2" style={{ width: width, height: height}}>
            <Image src={srcPath} alt="Profile picture" layout={width && height ? "fill" : "responsive"} objectFit="cover" className="rounded-full"/>
        </div>
    );
}
