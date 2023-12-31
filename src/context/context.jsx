import { createContext, useState, } from "react";
import regiones from "../data/regiones";
import { Text } from "react-native";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../FirebaseConfig";

export const RecordContext = createContext(null);

const RecordProvider = ({ children }) => {

    const [choosedItem, setChoosedItem] = useState('Región Metropolitana de Santiago');
    const [loading, setLoading] = useState(false);
    const [dataUserDb, setDataUserDb] = useState({})
    const [user, setUser] = useState(null)
    const [colegiosParseado, setColegiosParseado] = useState({})
    const [userId, setUserId] = useState()
    const [docs, setdocs] = useState([])
    const auth = FIREBASE_AUTH;
    const [reload, setReload] = useState(false)
        ; // Reemplaza 'tuDocumentoID' con el ID del documento que deseas buscar


    const getDataUser = async () => {
        const documentId = auth.currentUser.uid; // Asigna el valor antes de su uso

        const docRefUsuarios = doc(FIRESTORE_DB, 'usuarios', documentId);

        try {
            const docSnapshotUsuarios = await getDoc(docRefUsuarios);

            if (docSnapshotUsuarios.exists()) {
                const dataUsuarios = docSnapshotUsuarios.data();
                setDataUserDb(dataUsuarios);
                setUserId(docSnapshotUsuarios.id)

            } else {
                console.log('El documento no existe en usuarios');
            }
        } catch (error) {
            console.error('Error al buscar el documento en usuarios:', error);
        }

        try {
            console.log('ENTRO');
            const docRefEstudiantes = doc(FIRESTORE_DB, 'estudiantes', documentId);
            const docSnapshotEstudiantes = await getDoc(docRefEstudiantes);

            if (docSnapshotEstudiantes.exists()) {
                const dataEstudiantes = docSnapshotEstudiantes.data();
                console.log(docSnapshotEstudiantes.id, 'sd')
                setUserId(docSnapshotEstudiantes.id)
                setDataUserDb(dataEstudiantes);
            } else {
                console.log('El documento no existe en estudiantes');
            }
        } catch (error) {
            console.log(error);
        }
    }






    return (
        <RecordContext.Provider
            value={{
                regiones,
                choosedItem,
                setChoosedItem,
                loading,
                setLoading,
                dataUserDb,
                setDataUserDb,
                user,
                setUser,
                colegiosParseado,
                setColegiosParseado,
                getDataUser,
                docs,
                setdocs,
                setUserId,
                userId,
                setReload,
                reload


            }}
        >
            {children}
        </RecordContext.Provider>

    )
}
export default RecordProvider;