import { create } from 'zustand'
import {
  type TRDeliveryLocation,
  type TRDocumentData,
  type TRInstitution,
  type TRLot,
  type TRLotItem,
  type TRTemplateType,
  buildReviewState,
  createDocumentData,
  createEmptyDeliveryLocation,
  createEmptyLot,
  createEmptyLotItem,
  getDefaultTemplateForInstitution,
  getTemplateDefinition,
  hasMeaningfulData,
} from '@/features/tr/data/templates'
import {
  createInitialTRWizardData,
  type TRWizardContext,
  type TRWizardData,
} from '../types'

type TRWizardState = TRWizardData & {
  nextStep: () => void
  prevStep: () => void
  goToStep: (step: number) => void
  updateContext: (
    values: Partial<Omit<TRWizardContext, 'institution' | 'templateType'>>
  ) => void
  changeTemplate: (
    institution: TRInstitution,
    templateType?: TRTemplateType
  ) => void
  setFieldValue: (fieldId: string, value: string) => void
  addLot: () => void
  removeLot: (lotId: string) => void
  updateLot: (
    lotId: string,
    values: Partial<Omit<TRLot, 'items' | 'id'>>
  ) => void
  addLotItem: (lotId: string) => void
  updateLotItem: (
    lotId: string,
    itemId: string,
    values: Partial<Omit<TRLotItem, 'id'>>
  ) => void
  removeLotItem: (lotId: string, itemId: string) => void
  addDeliveryLocation: () => void
  updateDeliveryLocation: (
    deliveryId: string,
    values: Partial<Omit<TRDeliveryLocation, 'id'>>
  ) => void
  removeDeliveryLocation: (deliveryId: string) => void
  saveDraft: () => void
  startSubmission: () => void
  completeSubmission: () => void
  reset: () => void
  hasCustomData: () => boolean
}

function syncState(
  context: TRWizardContext,
  documentData: TRDocumentData,
  partial?: Partial<TRWizardData>
) {
  const template = getTemplateDefinition(
    context.institution,
    context.templateType
  )
  return {
    ...partial,
    context,
    documentData,
    reviewState: buildReviewState(context, template, documentData),
  }
}

function clampStep(step: number, context: TRWizardContext) {
  const template = getTemplateDefinition(
    context.institution,
    context.templateType
  )
  return Math.max(0, Math.min(step, template.sections.length))
}

export const useTRWizard = create<TRWizardState>()((set, get) => ({
  ...createInitialTRWizardData(),
  nextStep: () =>
    set((state) => ({
      currentStep: clampStep(state.currentStep + 1, state.context),
    })),
  prevStep: () =>
    set((state) => ({
      currentStep: clampStep(state.currentStep - 1, state.context),
    })),
  goToStep: (step) =>
    set((state) => ({
      currentStep: clampStep(step, state.context),
    })),
  updateContext: (values) =>
    set((state) => {
      const context = { ...state.context, ...values }
      return {
        ...syncState(context, state.documentData),
        isDirty: true,
      }
    }),
  changeTemplate: (institution, templateType) =>
    set((state) => {
      const nextTemplateType =
        templateType ?? getDefaultTemplateForInstitution(institution)
      const context = {
        ...state.context,
        institution,
        templateType: nextTemplateType,
      }
      const template = getTemplateDefinition(institution, nextTemplateType)
      const documentData = createDocumentData(template, state.documentData)
      return {
        ...syncState(context, documentData),
        currentStep: clampStep(0, context),
        isDirty: true,
      }
    }),
  setFieldValue: (fieldId, value) =>
    set((state) => {
      const documentData = { ...state.documentData, [fieldId]: value }
      return {
        ...syncState(state.context, documentData),
        isDirty: true,
      }
    }),
  addLot: () =>
    set((state) => {
      const lots = (
        (state.documentData.lots as TRLot[] | undefined) ?? []
      ).concat(createEmptyLot())
      const documentData = { ...state.documentData, lots }
      return {
        ...syncState(state.context, documentData),
        isDirty: true,
      }
    }),
  removeLot: (lotId) =>
    set((state) => {
      const currentLots = (state.documentData.lots as TRLot[] | undefined) ?? []
      const nextLots = currentLots.filter((lot) => lot.id !== lotId)
      const documentData = {
        ...state.documentData,
        lots: nextLots.length ? nextLots : [createEmptyLot()],
      }
      return {
        ...syncState(state.context, documentData),
        isDirty: true,
      }
    }),
  updateLot: (lotId, values) =>
    set((state) => {
      const lots = ((state.documentData.lots as TRLot[] | undefined) ?? []).map(
        (lot) => (lot.id === lotId ? { ...lot, ...values } : lot)
      )
      const documentData = { ...state.documentData, lots }
      return {
        ...syncState(state.context, documentData),
        isDirty: true,
      }
    }),
  addLotItem: (lotId) =>
    set((state) => {
      const lots = ((state.documentData.lots as TRLot[] | undefined) ?? []).map(
        (lot) =>
          lot.id === lotId
            ? { ...lot, items: lot.items.concat(createEmptyLotItem()) }
            : lot
      )
      const documentData = { ...state.documentData, lots }
      return {
        ...syncState(state.context, documentData),
        isDirty: true,
      }
    }),
  updateLotItem: (lotId, itemId, values) =>
    set((state) => {
      const lots = ((state.documentData.lots as TRLot[] | undefined) ?? []).map(
        (lot) =>
          lot.id === lotId
            ? {
                ...lot,
                items: lot.items.map((item) =>
                  item.id === itemId ? { ...item, ...values } : item
                ),
              }
            : lot
      )
      const documentData = { ...state.documentData, lots }
      return {
        ...syncState(state.context, documentData),
        isDirty: true,
      }
    }),
  removeLotItem: (lotId, itemId) =>
    set((state) => {
      const lots = ((state.documentData.lots as TRLot[] | undefined) ?? []).map(
        (lot) => {
          if (lot.id !== lotId) return lot
          const nextItems = lot.items.filter((item) => item.id !== itemId)
          return {
            ...lot,
            items: nextItems.length ? nextItems : [createEmptyLotItem()],
          }
        }
      )
      const documentData = { ...state.documentData, lots }
      return {
        ...syncState(state.context, documentData),
        isDirty: true,
      }
    }),
  addDeliveryLocation: () =>
    set((state) => {
      const deliveries = (
        (state.documentData.deliveries as TRDeliveryLocation[] | undefined) ??
        []
      ).concat(createEmptyDeliveryLocation())
      const documentData = { ...state.documentData, deliveries }
      return {
        ...syncState(state.context, documentData),
        isDirty: true,
      }
    }),
  updateDeliveryLocation: (deliveryId, values) =>
    set((state) => {
      const deliveries = (
        (state.documentData.deliveries as TRDeliveryLocation[] | undefined) ??
        []
      ).map((entry) =>
        entry.id === deliveryId ? { ...entry, ...values } : entry
      )
      const documentData = { ...state.documentData, deliveries }
      return {
        ...syncState(state.context, documentData),
        isDirty: true,
      }
    }),
  removeDeliveryLocation: (deliveryId) =>
    set((state) => {
      const currentDeliveries =
        (state.documentData.deliveries as TRDeliveryLocation[] | undefined) ??
        []
      const nextDeliveries = currentDeliveries.filter(
        (entry) => entry.id !== deliveryId
      )
      const documentData = {
        ...state.documentData,
        deliveries: nextDeliveries.length
          ? nextDeliveries
          : [createEmptyDeliveryLocation()],
      }
      return {
        ...syncState(state.context, documentData),
        isDirty: true,
      }
    }),
  saveDraft: () =>
    set((state) => ({
      submission: {
        ...state.submission,
        savedAt: new Intl.DateTimeFormat('pt-BR', {
          dateStyle: 'short',
          timeStyle: 'short',
        }).format(new Date()),
      },
      isDirty: false,
    })),
  startSubmission: () =>
    set((state) => ({
      submission: {
        ...state.submission,
        status: 'submitting',
        completedAt: '',
      },
    })),
  completeSubmission: () =>
    set((state) => ({
      submission: {
        ...state.submission,
        status: 'completed',
        completedAt: new Intl.DateTimeFormat('pt-BR', {
          dateStyle: 'short',
          timeStyle: 'short',
        }).format(new Date()),
      },
      isDirty: false,
    })),
  reset: () => set(createInitialTRWizardData()),
  hasCustomData: () => {
    const state = get()
    return (
      state.isDirty ||
      hasMeaningfulData(state.documentData) ||
      state.context.title.trim() !== '' ||
      state.context.responsibleUnit.trim() !== '' ||
      state.context.referenceCode.trim() !== ''
    )
  },
}))
