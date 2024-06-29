import EmptyIcon from "@assets/empty.svg";

type Props = {
  message: string;
};
export function EmptyState({ message }: Props) {
  return (
    <div className="flex justify-center items-center">
      <div className="relative z-10 px-20 py-24 flex flex-col justify-center items-center">
        <img src={EmptyIcon} alt="empty" className="w-16" />
        <h4 className="m-3 text-[1.25rem] text-grey-600">Found nothing</h4>
        <p className="text-grey-900 max-w-56 text-center mt-2 text-[0.9rem]">
          {message}
        </p>
      </div>
    </div>
  );
}
