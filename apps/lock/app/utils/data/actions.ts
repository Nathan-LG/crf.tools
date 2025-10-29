import { revalidate } from "../api/actions";
import { toast } from "@/app/utils/ui/actions";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export async function logNumberToText(number) {
  switch (number) {
    case 0:
      return "Verrouillage";
    case 1:
      return "Déverrouillage";
    default:
      return "Action inconnue";
  }
}

export async function onSubmit(
  data,
  setIsLoading,
  setError,
  type,
  router,
  action,
  modalId,
  redirect = null,
) {
  setIsLoading(true);

  if (setError) {
    setError(null);
  }

  const formData = Object.fromEntries(
    Object.entries(data)
      .filter(([_, v]) => v !== "")
      .filter(([_, v]) => v !== null)
      .map(([k, v]) => [k, String(v)]),
  );

  let typeMsg = "";
  let feminine = false;

  switch (type) {
    case "users":
      typeMsg = "Utilisateur";
      break;
    case "locks":
      typeMsg = "Serrure";
      feminine = true;
      break;
    default:
      typeMsg = "Ressource inconnue";
      feminine = true;
      break;
  }

  try {
    const response = await fetch(
      `/api/${type}/${action === "PUT" ? formData.id : ""}`,
      {
        method: action,
        body: new URLSearchParams(formData),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    const data = await response.json();

    if (action === "POST") {
      if (!data.success) {
        setError(data.error.message);
      } else {
        if (modalId) {
          document.getElementById(modalId).click();
        }
        if (redirect) {
          revalidate(redirect);
          router.push(redirect);
        }
      }
    } else if (action === "PUT") {
      if (!data.success) {
        toast(true, data.error.message);
      } else {
        toast(false, `${typeMsg} modifié${feminine ? "e" : ""} avec succès`);
        document.getElementById(modalId).click();

        if (redirect) {
          revalidate(redirect);
          router.push(redirect);
        }
      }
    }
  } catch (error) {
    if (action === "POST") {
      setError(error.message);
    } else {
      toast(true, error.message);
    }
  } finally {
    setIsLoading(false);
  }
}

export async function generateMetadataCustom(
  id,
  isNumber,
  prismaType,
  prefix = "",
): Promise<Metadata> {
  let returnName: { name: string };

  try {
    returnName = await prismaType.findUniqueOrThrow({
      select: {
        name: true,
      },
      where: {
        id: isNumber ? Number(id) : id,
      },
    });
  } catch {
    redirect("/errors/404");
  }

  return {
    title: `${prefix ? prefix : ""}${returnName.name}`,
  };
}

export const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then((res) => res.json());
