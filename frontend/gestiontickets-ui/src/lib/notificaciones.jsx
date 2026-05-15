import { toast } from "sonner";
import { CheckCircle, AlertCircle, X } from "lucide-react";

export const notify = (
  title,
  description = "",
  type = "success",
  CustomIcon = null,
) => {
  toast.custom((t) => (
    <div
      className={`
      bg-white rounded-md p-2 flex items-center gap-2 w-fit min-w-[200px] max-w-[600px] 
      animate-in zoom-in-95 slide-in-from-top-2 fade-in slide-in-from-right-5 
      shadow-[0_0_40px_-10px_rgba(0,0,0,0.25),0_0_20px_-5px_rgba(122,14,180,0.15)]     
      border-b-[6px] 
      ${type === "success" ? "border-b-green-500" : "border-b-red-500"}
    `}
    >
      <div
        className={`
        flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center
        ${type === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}
      `}
      >
        {CustomIcon ? (
          <CustomIcon size={20} />
        ) : type === "success" ? (
          <CheckCircle size={20} />
        ) : (
          <AlertCircle size={20} />
        )}
      </div>

      <div className="flex flex-col flex-1 text-left">
        <h3 className="text-zinc-900 font-bold text-[15px] leading-tight">
          {title}
        </h3>
        {description && (
          <p className="text-zinc-500 text-[12px] font-medium mt-1 italic leading-tight max-w-[220px]">
            {description}
          </p>
        )}
      </div>

      <button
        onClick={() => toast.dismiss(t)}
        className="ml-2 p-1.5 hover:bg-zinc-100 rounded-md text-zinc-300 hover:text-zinc-500 transition-colors"
      >
        <X size={16} strokeWidth={3} />
      </button>
    </div>
  ));
};
