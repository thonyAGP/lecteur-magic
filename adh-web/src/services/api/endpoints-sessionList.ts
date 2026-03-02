import { apiClient } from "@/services/api/apiClient"
import type { ApiResponse } from "@/services/api/apiClient"
import type { 
  Session, 
  SessionListApiResponse, 
  SessionListRequest 
} from "@/types/sessionList"
import { useDataSourceStore } from "@/stores/dataSourceStore"

export const listSessions = async (params?: SessionListRequest): Promise<SessionListApiResponse> => {
  const { isRealApi } = useDataSourceStore.getState()

  if (!isRealApi) {
    return {
      success: true,
      data: [
        {
          id: 1,
          societe: "ACME Corp",
          caisse: "Main Register",
          operateur: "John Doe",
          dateOuverture: new Date(),
          etat: "OPEN",
          montantOuverture: 1000.00
        }
      ],
      message: "Mocked session list"
    }
  }

  try {
    const response = await apiClient.get<Session[]>("/api/sessions/list", { 
      params 
    })

    return {
      success: true,
      data: response.data,
      message: "Sessions retrieved successfully"
    }
  } catch (error) {
    return {
      success: false,
      data: [],
      message: error instanceof Error ? error.message : "Unknown error"
    }
  }
}