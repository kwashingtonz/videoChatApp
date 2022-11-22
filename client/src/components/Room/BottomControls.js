import React from 'react';
const style = {
    position: 'fixed',
    width: '100%',
    padding: 20,
    bottom: 0
};
const BottomControls = ({ onLeave, toggleMute, toggleVideoMute, muted, videoMuted, }) => {
    return (<div className="btn" style={style}>
            <button className="btn-leave" onClick={onLeave}>
                <span className="icon">
                    <i className="fas fa-phone-slash"/>
                </span>
                <span>Leave call</span>
            </button>
            <button className={`btn-mute`} onClick={toggleMute}>
                <span className="icon">
                    <i className={`fas ${muted ? 'fa-microphone-slash' : 'fa-microphone'}`}></i>
                </span>
                <span>{muted ? 'Unmute' : 'Mute'}</span>
            </button>
            <button className={`btn-vmute`} onClick={toggleVideoMute}>
                <span className="icon">
                    <i className={`fas ${videoMuted ? 'fa-video-slash' : 'fa-video'}`}></i>
                </span>
                <span>{videoMuted ? 'Turn video on' : 'Turn video off'}</span>
            </button>
        </div>);
};
export default BottomControls;
