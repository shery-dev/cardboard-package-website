
"use client";

import { Button, Modal } from "flowbite-react";
import PinchZoom from "../PinchZoom/PinchZoom";

export function ImageModel({ toggleHandler, openVal, imgSrc }) {

    return (
        <>
            <Modal show={openVal} onClose={() => toggleHandler(false)}>
                <Modal.Header>Image</Modal.Header>
                <Modal.Body>
                    <div className="space-y-6">
                        <PinchZoom
                            imgSrc={imgSrc}
                         />
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}
