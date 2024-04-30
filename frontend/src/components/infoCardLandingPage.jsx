import React from 'react';

function InfoCardLandingPage({ title, description, Icon }) { 
    return (
        <div className="m-2">
            <div className="block max-w-sm p-6 bg-gradient-to-r from-slate-100 to-slate-200 border border-4 border-orange-400 rounded-xl shadow">
                <h5 className="mb-2 text-2xl font-cairo font-bold tracking-tight text-gray-900">
                    
                    <p className='text-xl'>{Icon && <Icon className="inline-block mr-2 text-4xl mb-1 text-orange-400" />} {title}</p>
                </h5>
                <p className="font-cairo text-lg text-gray-700 h-80 pt-5">{description}</p>
            </div>
        </div>
    );
}

export default InfoCardLandingPage;
