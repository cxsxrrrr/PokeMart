import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "@heroui/react";
import { IconArrowLeft, IconCheck, IconUserCircle } from "@tabler/icons-react";
import { AVATAR_OPTIONS } from "../../utils/constants";
import { useAuth } from "../../hooks/useAuth";

const FALLBACK_AVATAR = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png";

export default function ProfileSettings() {
  const navigate = useNavigate();
  const { user, updateProfile, loading, error, setError } = useAuth();

  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(FALLBACK_AVATAR);
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    if (!user) return;
    setUsername(user.username || "");
    setAvatarUrl(user.avatarUrl || FALLBACK_AVATAR);
  }, [user]);

  useEffect(() => {
    setError(null);
  }, [setError]);

  const isUnchanged = useMemo(() => {
    if (!user) return true;
    const currentAvatar = user.avatarUrl || FALLBACK_AVATAR;
    return username.trim() === (user.username || "") && avatarUrl === currentAvatar;
  }, [avatarUrl, user, username]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSavedMessage("");

    const cleanUsername = username.trim();
    if (!cleanUsername) {
      return;
    }

    try {
      await updateProfile({ username: cleanUsername, avatarUrl });
      setSavedMessage("Perfil actualizado correctamente.");
    } catch (_) {
      // Error is handled by useAuth state
    }
  };

  return (
    <div className="container mx-auto px-5 pb-16 min-h-[80vh]">
      <div className="max-w-3xl mx-auto">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-2 text-sm font-bold text-violet-700 dark:text-cyan-400 hover:underline mt-6"
        >
          <IconArrowLeft size={16} /> Volver al dashboard
        </button>

        <div className="mt-4 bg-white dark:bg-[#17223b] border border-slate-100 dark:border-[#243354] rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <IconUserCircle size={32} className="text-violet-700 dark:text-cyan-400" />
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">Configuración de Perfil</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Cambia tu nombre de usuario y foto de perfil.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              isRequired
              label="Nombre de usuario"
              labelPlacement="outside"
              placeholder="Tu nombre de usuario"
              value={username}
              onValueChange={setUsername}
              variant="bordered"
              radius="sm"
              classNames={{
                label: "font-semibold text-slate-700 dark:text-slate-300 pb-1",
                inputWrapper: "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-violet-300 dark:hover:border-cyan-700 focus-within:!border-violet-600 dark:focus-within:!border-cyan-400 h-12 shadow-sm transition-colors",
                input: "text-slate-900 dark:text-white"
              }}
            />

            <div className="space-y-3">
              <label className="font-semibold text-slate-700 dark:text-cyan-300 text-sm">Foto de perfil</label>
              <div className="flex gap-3 flex-wrap">
                {AVATAR_OPTIONS.map((url) => (
                  <button
                    key={url}
                    type="button"
                    onClick={() => setAvatarUrl(url)}
                    className={`w-14 h-14 rounded-full border-2 overflow-hidden transition-all bg-violet-100 dark:bg-slate-800 ${
                      avatarUrl === url
                        ? "border-violet-600 dark:border-cyan-400 scale-110 shadow-md"
                        : "border-transparent opacity-75 hover:opacity-100"
                    }`}
                  >
                    <img src={url} alt="Avatar option" className="w-full h-full object-cover scale-125" />
                  </button>
                ))}
              </div>
            </div>

            {(error || savedMessage) && (
              <div className={`text-sm font-medium rounded-lg px-3 py-2 ${error ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"}`}>
                {error || savedMessage}
              </div>
            )}

            <div className="flex justify-end">
              <Button
                type="submit"
                isLoading={loading}
                isDisabled={isUnchanged || !username.trim()}
                className="font-bold bg-violet-800 hover:bg-violet-900 text-white dark:bg-cyan-500 dark:text-slate-900 dark:hover:bg-cyan-400"
                startContent={<IconCheck size={16} />}
              >
                Guardar cambios
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
