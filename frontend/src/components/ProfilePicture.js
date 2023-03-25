export function ProfilePicture({srcPath, width, height}){
    
    return (
        <img src={srcPath} style={{objectFit: 'cover', borderRadius: "50%", width: width, height: height}}></img>
    )
}

export function SmallProfilePicture({srcPath}){
    
    return (
        <ProfilePicture srcPath={srcPath} width={50} height={50}></ProfilePicture>
    )
}

export function LargeProfilePicture({srcPath}){
    
    return (
        <ProfilePicture srcPath={srcPath} width={100} height={100}></ProfilePicture>
    )
}