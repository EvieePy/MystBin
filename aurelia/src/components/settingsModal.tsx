import { createEffect, Show } from "solid-js";

interface HandleOutsideClick {
    (e: MouseEvent): void;
}

interface Props {
    showModal: boolean;
    title: string;
    onOutsideClick: HandleOutsideClick;
}

export default function SettingsModal(props: Props) {
    const showModal = () => props.showModal;
    const title = () => props.title;
    const handleOutside = () => props.onOutsideClick;

    createEffect(() => {
        if (!showModal()) {
            document.body.classList.remove("modalOpen");
        } else {
            document.body.classList.add("modalOpen");
        }
    });

    const handleInnerClick = (e: MouseEvent) => {
        e.stopPropagation();
    }

    return (
        <Show when={showModal()} fallback={null}>
            <div class="outerModal" onclick={handleOutside()}>
                <div class="dialogContainer">
                    <div class="innerModal" onclick={handleInnerClick}>
                        <span class="title">{title()}</span>
                        <hr />
                        <span>Hello World</span>
                    </div>
                </div>
            </div>
        </Show>
    )
}
