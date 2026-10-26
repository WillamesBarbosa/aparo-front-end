'use client'

import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"
import {servicesService, type ServicePayload} from '@/services/services-service'

export const servicesKey = ['services'] as const

export function useServices(){
    return useQuery({
        queryKey: servicesKey,
        queryFn: servicesService.list,
    })
}

export function useCreateServices(){
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (payload: ServicePayload) => servicesService.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: servicesKey})
        }
    })
}

export function useUpdateServices(){
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({id, payload}: {id: string, payload: Partial<ServicePayload>}) => 
            servicesService.update(id, payload),
        
    onSuccess: ()=> {
        queryClient.invalidateQueries({queryKey: servicesKey})
    }
    })
}

export function useDeleteServices(){
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => servicesService.remove(id),
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey: servicesKey})
        }
    })
}