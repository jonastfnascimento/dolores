import { provide, inject, type InjectionKey } from 'vue';

export function useProvideContext<ContextValue>(contextName: string) {
  const injectionKey: InjectionKey<ContextValue | null> =
    Symbol.for(contextName);

  function injectContext(): ContextValue {
    const context = inject(injectionKey);

    if (context) return context;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (context === null) return context as any;

    throw new Error(
      `Injection \`${contextName}\` not found. Component must be used inside`
    );
  }

  function provideContext(contextValue: ContextValue) {
    provide(injectionKey, contextValue);

    return contextValue;
  }

  return [injectContext, provideContext] as const;
}
